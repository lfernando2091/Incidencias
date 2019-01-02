var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');

const email = "incidencia.report@hotmail.com";

const password = "LuisFernando2091@";

/* GET Periodo. */
router.get('/', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

	      var docentes;

	      var categoria_incidencia;

	      var periodo;

	      var programa_educativo;

	      mappers.loadMapper('/menu/docente');
	      connection.query(mappers.onQuery('docente', 'listado', null), [], function(err4, results4) {
	      	docentes = results4;	      

	      mappers.loadMapper('/menu/categoria_incidencia');
	      connection.query(mappers.onQuery('categoria_incidencia', 'listado', null), [], function(err3, results3) {
	      	categoria_incidencia = results3;	      

	      mappers.loadMapper('/menu/periodo');
	      connection.query(mappers.onQuery('periodo', 'listado', null), [], function(err2, results2) {
	      	periodo = results2;	      

	      mappers.loadMapper('/menu/programa_educativo');
	      connection.query(mappers.onQuery('programa_educativo', 'listado', null), [], function(err1, results1) {
	      	programa_educativo = results1;	      

	      mappers.loadMapper('/menu/docente_incidencia');
	      connection.query(mappers.onQuery('docente_incidencia', 'catalogo', null), [], function(err, results) {
	        if (err) return next(err); 
	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);

	        var result = new Array(
	        	(!Object.keys(results).length) ? new Array() : results, 
	        	(!Object.keys(docentes).length) ? new Array() : docentes,
	        	(!Object.keys(categoria_incidencia).length) ? new Array() : categoria_incidencia,
	        	(!Object.keys(periodo).length) ? new Array() : periodo,
	        	(!Object.keys(programa_educativo).length) ? new Array() : programa_educativo
	        );
	        req.flash('results', result);
	        req.flash('content', 'docente_incidencia');
			return res.redirect('/welcome'); 

	      });

	      });

	      });

	      });

	      });

	});
});

/* POST Periodo Agregar.*/
router.post('/agregar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
		        id_docente : req.body.id_docente_n,
		        id_categoria_incidencia : req.body.id_categoria_incidencia_n,
		        id_periodo : req.body.id_periodo_n,
		        id_programa_educativo : req.body.id_programa_educativo_n,
		        descripcion : req.body.descripcion_n
		    } 
		if(req.body.id_docente_n == '' || 
			req.body.id_categoria_incidencia_n == '' ||
			req.body.id_periodo_n == '' || 
			req.body.id_programa_educativo_n == '' ||
			req.body.descripcion_n == '')
	    {
	    	var values = { 
		        id_docente_n : req.body.id_docente_n,
		        id_categoria_incidencia_n : req.body.id_categoria_incidencia_n,
		        id_periodo_n : req.body.id_periodo_n,
		        id_programa_educativo_n : req.body.id_programa_educativo_n,
		        descripcion_n : req.body.descripcion_n
		    } 
	    	req.flash('alert', 'Uno o más campos estan vacios');
		    req.flash('modal-values', values);
		    req.flash('modal', 'modal-nuevo');
	    	return res.redirect('/docente_incidencia');	
	    }

	    mappers.loadMapper('/menu/docente_incidencia');
	      connection.query(mappers.onQuery('docente_incidencia', 'agregar', param), [], function(err, results) {
	        if (err) return next(err); 

	    	mappers.loadMapper('/menu/docente');
	        connection.query(mappers.onQuery('docente', 'docente_info', param), [], function(err2, results2) {
	        	if (err2) return next(err2);

	        	mappers.loadMapper('/menu/categoria_incidencia');
	        	connection.query(mappers.onQuery('categoria_incidencia', 'categoria_incidencia_info', param), [], function(err3, results3) {
	        		if (err3) return next(err3);

	        		SendEmail(
		        	email,
		        	password,
		        	req.user.Email + ',' + results2.Correo,
		        	'Haz sido reportado',
		        	results2[0].Nombre + ' ' +  results2[0].ApellidoPaterno + ' ' + results2[0].ApellidoMaterno,
		        	results3[0].Nombre,
		        	req.body.descripcion_n
			        );

			        req.flash('mensaje', 'Nuevo elemento agregado');

					return res.redirect('/docente_incidencia');
		        });
	        });
	    });
	});
});

function SendEmail(fromemail, password, toemai, subject, docent, type, text){
	var transporter = nodemailer.createTransport({
	  service: 'hotmail',
	  auth: {
	    user: fromemail,
	    pass: password
	  }
	});

	var mailOptions = {
	  from: fromemail,
	  to: toemai,
	  subject: subject,
	  text: 'DETALLES',
	  html: '<h1>' + docent +'</h1><p>TIPO: '+ type +'</p><p>DESCRIPCIÓN: '+text+'</p>'
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error)
	    console.log(error);
	});
}

/* POST Periodo Editar.*/
router.post('/editar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
				id : req.body._id,
		        id_categoria_incidencia : req.body.id_categoria_incidencia_e,
		        id_periodo : req.body.id_periodo_e,
		        id_programa_educativo : req.body.id_programa_educativo_e,
		        descripcion : req.body.descripcion_e
		    } 

		    if(req.body.id_categoria_incidencia_e == '' ||
		    	req.body.id_periodo_e == '' || 
		    	req.body.id_programa_educativo_e == '' || 
		    	req.body.descripcion_e == '')
		    {
		    	var values = { 
			        id_categoria_incidencia_e : req.body.id_categoria_incidencia_e,
			        id_periodo_e : req.body.id_periodo_e,
			        id_programa_educativo_e : req.body.id_programa_educativo_e,
			        descripcion_e : req.body.descripcion_e
			    } 
		    	req.flash('alert', 'Uno o más campos estan vacios');
			    req.flash('modal-values', values);
			    req.flash('modal', 'modal-editar');
		    	return res.redirect('/docente_incidencia');	
		    }


		  mappers.loadMapper('/menu/docente_incidencia');
	      connection.query(mappers.onQuery('docente_incidencia', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/docente_incidencia'); 

	      });
	});
});

/* POST Periodo Eliminar.*/
router.post('/eliminar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
				id : req.body._idU
		    } 

		  mappers.loadMapper('/menu/docente_incidencia');
	      connection.query(mappers.onQuery('docente_incidencia', 'eliminar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento eliminado con exito');

			return res.redirect('/docente_incidencia'); 

	      });
	});
});

router.post('/filtro', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

     	var param = { 
		        id_docente: req.body.is_id_docente_b != 'on' ? '' : req.body.id_docente_b,
		        id_categoria_incidencia : req.body.is_id_categoria_incidencia_b != 'on' ? '' : req.body.id_categoria_incidencia_b,
		        id_periodo : req.body.is_id_periodo_b != 'on' ? '' : req.body.id_periodo_b,
		        id_programa_educativo : req.body.is_id_programa_educativo_b != 'on' ? '' : req.body.id_programa_educativo_b,
		        fecha_1 : req.body.is_fecha_b_1 != 'on' ? '' : req.body.fecha_b_1,
		        fecha_2 : req.body.is_fecha_b_2 != 'on' ? '' : req.body.fecha_b_2
		    } 

	      mappers.loadMapper('/menu/docente_incidencia');
	      connection.query(mappers.onQuery('docente_incidencia', 'listado', param), [], function(err, results) {
	        if (err) return next(err); 
	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);

	        req.flash('results', (!Object.keys(results).length) ? '' : results);
	        req.flash('content', 'docente_incidencia_filtro');
			return res.redirect('/welcome'); 

	      });

	});
});

module.exports = router;

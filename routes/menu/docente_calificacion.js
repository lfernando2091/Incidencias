var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var indexerCount = 0;

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');

const email = "incidencia.report@hotmail.com";

const password = "LuisFernando2091@";

/* GET Periodo. */
router.get('/', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      indexerCount = 0;

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

	      var docentes;

	      //var criterio;

	      var periodo;

	      mappers.loadMapper('/menu/docente');
	      connection.query(mappers.onQuery('docente', 'listado', null), [], function(err3, results3) {
	      	docentes = results3;	      
/*
	      mappers.loadMapper('/menu/criterio');
	      connection.query(mappers.onQuery('criterio', 'listado', null), [], function(err2, results2) {
	      	criterio = results2;	      
*/
	      mappers.loadMapper('/menu/periodo');
	      connection.query(mappers.onQuery('periodo', 'listado', null), [], function(err1, results1) {
	      	periodo = results1;	      

	      mappers.loadMapper('/menu/docente_calificacion');
	      connection.query(mappers.onQuery('docente_calificacion', 'catalogo', null), [], function(err, results) {
	        if (err) return next(err); 

		      mappers.loadMapper('/menu/docente_calificacion_criterio');	        
		      for (var i = 0; i < results.length; i++) 
		      {
		        	var param = {id_docente_calificacion : results[i].Id} 
		        	results[i].Calificaciones = new Array();	        	
				    connection.query(mappers.onQuery('docente_calificacion_criterio', 'findById', param), [], function(err4, results4) {
				      	if (err4) return next(err4); 

				      	results[indexerCount].Calificaciones.push(results4);

				      	indexerCount++;

				      	if(indexerCount==results.length)
				      	{
				      		req.flash('mensaje', isMyObjectEmpty ? '' : msj);
					        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
					        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
					        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);

					        var result = new Array(
					        	(!Object.keys(results).length) ? new Array() : results, 
					        	(!Object.keys(docentes).length) ? new Array() : docentes,
					        	(!Object.keys(periodo).length) ? new Array() : periodo
					        );

					        req.flash('results', result);
					        req.flash('content', 'docente_calificacion');
							return res.redirect('/welcome'); 
				      	}
				    });
		      }
	      });

	      });
/*
	      });
*/
	      });
	});
});

/* POST Periodo Agregar.*/
router.post('/agregar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
		        id_docente : req.body.id_docente_n,
		        id_periodo : req.body.id_periodo_n
		    } 
		if(req.body.id_docente_n == '' || 
			req.body.id_periodo_n == '')
	    {
	    	var values = { 
		        id_docente_n : req.body.id_docente_n,
		        id_periodo_n : req.body.id_periodo_n
		    } 
	    	req.flash('alert', 'Uno o más campos estan vacios');
		    req.flash('modal-values', values);
		    req.flash('modal', 'modal-nuevo');
	    	return res.redirect('/docente_calificacion');	
	    }

	    mappers.loadMapper('/menu/docente_calificacion');
	      connection.query(mappers.onQuery('docente_calificacion', 'agregar', param), [], function(err, results) {
	        if (err) return next(err); 

			req.flash('mensaje', 'Nuevo elemento agregado');

			return res.redirect('/docente_calificacion_criterio/' + results.insertId);

	    });
	});
});

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
		    	return res.redirect('/docente_calificacion');	
		    }


		  mappers.loadMapper('/menu/docente_calificacion');
	      connection.query(mappers.onQuery('docente_calificacion', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/docente_calificacion'); 

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

		  mappers.loadMapper('/menu/docente_calificacion');
	      connection.query(mappers.onQuery('docente_calificacion', 'eliminar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento eliminado con exito');

			return res.redirect('/docente_calificacion'); 

	      });
	});
});

router.post('/filtro', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      indexerCount = 0;

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

     	var param = { 
		        id_docente: req.body.is_id_docente_b != 'on' ? '' : req.body.id_docente_b,
		        id_periodo : req.body.is_id_periodo_b != 'on' ? '' : req.body.id_periodo_b,
		        fecha_1 : req.body.is_fecha_b_1 != 'on' ? '' : req.body.fecha_b_1,
		        fecha_2 : req.body.is_fecha_b_2 != 'on' ? '' : req.body.fecha_b_2
		    } 

	      mappers.loadMapper('/menu/docente_calificacion');
	      connection.query(mappers.onQuery('docente_calificacion', 'listado', param), [], function(err, results) {
	        if (err) return next(err); 

		      mappers.loadMapper('/menu/docente_calificacion_criterio');	        
		      for (var i = 0; i < results.length; i++) 
		      {
		        	var param2 = {id_docente_calificacion : results[i].Id} 

		        	results[i].Calificaciones = new Array();	

				    connection.query(mappers.onQuery('docente_calificacion_criterio', 'findById', param2), [], function(err4, results4) {
				      	if (err4) return next(err4); 

				      	results[indexerCount].Calificaciones.push(results4);

				      	indexerCount++;

				      	if(indexerCount==results.length)
				      	{
				      		req.flash('mensaje', isMyObjectEmpty ? '' : msj);
					        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
					        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
					        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);

					        req.flash('results', (!Object.keys(results).length) ? '' : results);
					        req.flash('content', 'docente_calificacion_filtro');
							return res.redirect('/welcome'); 
				      	}
				    });
		      }
	      });
	});
});

module.exports = router;

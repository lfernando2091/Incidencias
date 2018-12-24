var express = require('express');
var router = express.Router();

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');
mappers.loadMapper('/menu/docente');

const fs = require('fs');

/* GET Periodo. */
router.get('/', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

	      connection.query(mappers.onQuery('docente', 'catalogo', null), [], function(err, results) {
	        if (err) return next(err); 
	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);
	        req.flash('results', results);
	        req.flash('content', 'docente');
			return res.redirect('/welcome'); 

	      });
	});
});

/* POST Periodo Agregar.*/
/*
router.post('/imagen', upload.single('imageFile'), function(req, res, next){
	console.log(req.file);
	console.log(req.body);
});
*/

/* POST Periodo Agregar.*/
router.post('/agregar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			
		if(req.body.nombre_n == '' || 
			req.body.apellido_paterno_n == '' ||
			req.body.apellido_materno_n == '' ||
			req.body.correo_electronico_n == '' ||
			req.body.fecha_nacimiento_n == '' ||
			req.body.cedula_profesional_n == '' ||
			req.body.numero_telefonico_n == '' ||
			req.body.fotografia_n == '' ||
			req.body.tipo_horario_n == '' )
	    {
	    	var values = { 
		        nombre_n : req.body.nombre_n,
		        apellido_paterno_n : req.body.apellido_paterno_n,
		        apellido_materno_n : req.body.apellido_materno_n,
		        correo_electronico_n : req.body.correo_electronico_n,
		        fecha_nacimiento_n : req.body.fecha_nacimiento_n,
		        cedula_profesional_n : req.body.cedula_profesional_n,
		        numero_telefonico_n : req.body.numero_telefonico_n,
		        tipo_horario_n : req.body.tipo_horario_n
		    } 
	    	req.flash('alert', 'Uno o más campos estan vacios');
		    req.flash('modal-values', values);
		    req.flash('modal', 'modal-nuevo');
	    	return res.redirect('/docente');	
	    }

	    var param = { 
		        nombre : req.body.nombre_n,
		        apellido_paterno : req.body.apellido_paterno_n,
		        apellido_materno : req.body.apellido_materno_n,
		        correo_electronico : req.body.correo_electronico_n,
		        fecha_nacimiento : req.body.fecha_nacimiento_n,
		        cedula_profesional : req.body.cedula_profesional_n,
		        numero_telefonico : req.body.numero_telefonico_n,
		        fotografia : 'temp/' + req.files['fotografia_n'][0].filename,
		        tipo_horario : req.body.tipo_horario_n
		    } 

	      connection.query(mappers.onQuery('docente', 'agregar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Nuevo elemento agregado');

			return res.redirect('/docente'); 

	      });

	});
});

/* POST Periodo Editar.*/
router.post('/editar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			if(req.body.correo_electronico_e == '' || 
				req.body.numero_telefonico_e == '' ||
				req.body.fotografia_e == '' ||
				req.body.tipo_horario_e == '')
		    {
		    	var values = { 
			        correo_electronico_e : req.body.correo_electronico_e,
			        numero_telefonico_e : req.body.numero_telefonico_e,
			        tipo_horario_e : req.body.tipo_horario_e
			    } 
		    	req.flash('alert', 'Uno o más campos estan vacios');
			    req.flash('modal-values', values);
			    req.flash('modal', 'modal-editar');
		    	return res.redirect('/docente');	
		    }

		    var param = { 
				id : req.body._id,
		        correo_electronico : req.body.correo_electronico_e,
		        numero_telefonico : req.body.numero_telefonico_e,
		        fotografia : 'temp/' + req.files['fotografia_e'][0].filename,
		        tipo_horario : req.body.tipo_horario_e
		    } 

	      connection.query(mappers.onQuery('docente', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/docente'); 

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
	      connection.query(mappers.onQuery('docente', 'eliminar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento eliminado con exito');

			return res.redirect('/docente'); 

	      });
	});
});

module.exports = router;

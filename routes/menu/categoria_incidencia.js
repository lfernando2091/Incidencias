var express = require('express');
var router = express.Router();

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');
mappers.loadMapper('/menu/categoria_incidencia');

/* GET Periodo. */
router.get('/', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

	      connection.query(mappers.onQuery('categoria_incidencia', 'catalogo', null), [], function(err, results) {
	        if (err) return next(err); 
	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);
	        req.flash('results', (!Object.keys(results).length) ? '' : results);
	        req.flash('content', 'categoria_incidencia');
			return res.redirect('/welcome'); 

	      });
	});
});

/* POST Periodo Agregar.*/
router.post('/agregar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
		        nombre : req.body.nombre_n
		    } 
		if(req.body.nombre_n == '' || req.body.clave_n == '')
	    {
	    	var values = { 
		        nombre_n : req.body.nombre_n
		    } 
	    	req.flash('alert', 'Uno o más campos estan vacios');
		    req.flash('modal-values', values);
		    req.flash('modal', 'modal-nuevo');
	    	return res.redirect('/categoria_incidencia');	
	    }

	      connection.query(mappers.onQuery('categoria_incidencia', 'agregar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Nuevo elemento agregado');

			return res.redirect('/categoria_incidencia'); 

	      });
	});
});

/* POST Periodo Editar.*/
router.post('/editar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
				id : req.body._id,
		        nombre : req.body.nombre_e
		    } 

		    if(req.body.nombre_e == '' || req.body.clave_e == '')
		    {
		    	var values = { 
			        nombre_e : req.body.nombre_e
			    } 
		    	req.flash('alert', 'Uno o más campos estan vacios');
			    req.flash('modal-values', values);
			    req.flash('modal', 'modal-editar');
		    	return res.redirect('/categoria_incidencia');	
		    }

	      connection.query(mappers.onQuery('categoria_incidencia', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/categoria_incidencia'); 

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
	      connection.query(mappers.onQuery('categoria_incidencia', 'eliminar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento eliminado con exito');

			return res.redirect('/categoria_incidencia'); 

	      });
	});
});

module.exports = router;

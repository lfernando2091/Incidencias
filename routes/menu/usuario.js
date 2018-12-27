var express = require('express');
var router = express.Router();

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');
mappers.loadMapper('/usuario');

/* GET Periodo. */
router.get('/', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

	      connection.query(mappers.onQuery('usuario', 'catalogo', null), [], function(err, results) {
	        if (err) return next(err); 
	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);
	        req.flash('results', (!Object.keys(results).length) ? '' : results);
	        req.flash('content', 'usuario');
			return res.redirect('/welcome'); 

	      });
	});
});

/* POST Periodo Agregar.*/
router.post('/agregar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
		        usuario : req.body.usuario_n,
		        tipo : req.body.tipo_n,
		        email : req.body.email_n,
		        token: ''
		    } 
		if(req.body.usuario_n == '' || req.body.tipo_n == '' || req.body.email_n == '')
	    {
	    	var values = { 
		        usuario_n : req.body.usuario_n,
		        tipo_n : req.body.tipo_n,
		        email_n : req.body.email_n
		    } 
	    	req.flash('alert', 'Uno o más campos estan vacios');
		    req.flash('modal-values', values);
		    req.flash('modal', 'modal-nuevo');
	    	return res.redirect('/usuario');	
	    }

	      connection.query(mappers.onQuery('usuario', 'agregar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Nuevo elemento agregado');

			return res.redirect('/usuario'); 

	      });
	});
});

/* POST Periodo Editar.*/
router.post('/editar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
				id : req.body._id,
		        usuario : req.body.usuario_e,
		        tipo : req.body.tipo_e,
		        email : req.body.email_e
		    } 

		    if(req.body.usuario_e == '' || req.body.tipo_e == '' || req.body.email_e == '')
		    {
		    	var values = { 
			        usuario_e : req.body.usuario_e,
			        tipo_e : req.body.tipo_e,
			        email_e : req.body.email_e
			    } 
		    	req.flash('alert', 'Uno o más campos estan vacios');
			    req.flash('modal-values', values);
			    req.flash('modal', 'modal-editar');
		    	return res.redirect('/usuario');	
		    }

	      connection.query(mappers.onQuery('usuario', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/usuario'); 

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
	      connection.query(mappers.onQuery('usuario', 'eliminar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento eliminado con exito');

			return res.redirect('/usuario'); 

	      });
	});
});

module.exports = router;

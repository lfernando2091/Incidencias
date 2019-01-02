var express = require('express');
var router = express.Router();

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');


/* GET Periodo. */
router.get('/:id', function(req, res, next){
	if (!req.session || !req.session.authenticated || !req.isAuthenticated())
       	return res.render('./403', { status: 403, title: 'No autorizado' });

    if(req.params.id != '' && req.params.id!= null){
    	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      var param = {id_docente_calificacion: req.params.id}

	      var msj = req.flash("mensaje");

	      var modal = req.flash("modal");

	      var modal_values = req.flash("modal-values");

	      var alert = req.flash("alert");

	      var isMyObjectEmpty = !Object.keys(msj).length;

	      var docentes;

	      var criterio;

	      mappers.loadMapper('/menu/criterio');
	      connection.query(mappers.onQuery('criterio', 'listado', null), [], function(err2, results2) {
	      if (err2) return next(err2);

	      	criterio = results2;

	      mappers.loadMapper('/menu/docente_calificacion');
	      connection.query(mappers.onQuery('docente_calificacion', 'findById', {id: req.params.id}), [], function(err1, results1) {
	      		if (err1) return next(err1); 

	      		docentes = results1;

	      		mappers.loadMapper('/menu/docente_calificacion_criterio');
		      	connection.query(mappers.onQuery('docente_calificacion_criterio', 'catalogo', param), [], function(err, results) {
		        if (err) return next(err); 

		        var result = new Array(
					(!Object.keys(results).length) ? new Array() : results, 
					(!Object.keys(docentes).length) ? new Array() : docentes,
					(!Object.keys(criterio).length) ? new Array() : criterio,
					req.params.id
				);

		        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
		        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
		        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
		        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);
		        req.flash('results', result);
		        req.flash('content', 'docente_calificacion_criterio');
				return res.redirect('/welcome'); 

		      });

		   });

	       });

		});
    }else
		next();
});

/* POST Periodo Agregar.*/
router.post('/agregar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
				id_docente_calificacion : req.body._id_docente_calificacion_n,
		        id_criterio : req.body.criterio_n,
		        calificacion : req.body.calificacion_n
		    } 
		if(req.body._id_docente_calificacion_n == '' || 
			req.body.criterio_n == '' ||
			req.body.calificacion_n == '')
	    {
	    	var values = { 
	    		_id_docente_calificacion_n : req.body._id_docente_calificacion_n,
		        criterio_n : req.body.criterio_n,
		        calificacion_n : req.body.calificacion_n
		    } 
	    	req.flash('alert', 'Uno o más campos estan vacios');
		    req.flash('modal-values', values);
		    req.flash('modal', 'modal-nuevo');
	    	return res.redirect('/docente_calificacion_criterio');	
	    }

	      connection.query(mappers.onQuery('docente_calificacion_criterio', 'agregar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Nuevo elemento agregado');

			return res.redirect('/docente_calificacion_criterio/'+req.body._id_docente_calificacion_n); 

	      });
	});
});

/* POST Periodo Editar.*/
router.post('/editar', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);
			var param = { 
				id : req.body._id,
		        calificacion : req.body.calificacion_e
		    } 

		    if(req.body.calificacion_e == '')
		    {
		    	var values = { 
			        _id : req.body._id,
			        calificacion_e : req.body.calificacion_e
			    } 
		    	req.flash('alert', 'Uno o más campos estan vacios');
			    req.flash('modal-values', values);
			    req.flash('modal', 'modal-editar');
		    	return res.redirect('/docente_calificacion_criterio/'+req.body._id_docente_calificacion_e);	
		    }

	      connection.query(mappers.onQuery('docente_calificacion_criterio', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/docente_calificacion_criterio/'+req.body._id_docente_calificacion_e); 

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
	      connection.query(mappers.onQuery('docente_calificacion_criterio', 'eliminar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento eliminado con exito');

			return res.redirect('/docente_calificacion_criterio/'+req.body._id_docente_calificacion_x); 

	      });
	});
});

module.exports = router;

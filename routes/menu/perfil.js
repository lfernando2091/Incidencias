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

	      req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);
	        req.flash('results', req.user);
	        req.flash('content', 'perfil');
			return res.redirect('/welcome'); 
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
		    	return res.redirect('/perfil');	
		    }

	      connection.query(mappers.onQuery('usuario', 'actualizar', param), [], function(err, results) {
	        if (err) return next(err); 

	        req.flash('mensaje', 'Elemento editado con exito');
	        
			return res.redirect('/perfil'); 

	      });
	});
});

module.exports = router;

var express = require('express');
var router = express.Router();

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');

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

	      mappers.loadMapper('/menu/periodo');
	      connection.query(mappers.onQuery('periodo', 'listado', null), [], function(err2, results2) {
	      	periodo = results2;	      

	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);

	        var result = new Array(
	        	(!Object.keys(docentes).length) ? new Array() : docentes,
	        	(!Object.keys(periodo).length) ? new Array() : periodo
	        );
	        req.flash('results', result);
	        req.flash('content', 'reporte_calificaciones');
			return res.redirect('/welcome'); 

	      });

	      });
	});
});

module.exports = router;

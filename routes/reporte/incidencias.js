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

	      mappers.loadMapper('/menu/categoria_incidencia');
	      connection.query(mappers.onQuery('categoria_incidencia', 'listado', null), [], function(err3, results3) {
	      	categoria_incidencia = results3;	      

	      mappers.loadMapper('/menu/periodo');
	      connection.query(mappers.onQuery('periodo', 'listado', null), [], function(err2, results2) {
	      	periodo = results2;	      

	      mappers.loadMapper('/menu/programa_educativo');
	      connection.query(mappers.onQuery('programa_educativo', 'listado', null), [], function(err1, results1) {
	        if (err1) return next(err); 

	        programa_educativo = results1;	 
	        req.flash('mensaje', isMyObjectEmpty ? '' : msj);
	        req.flash('modal', (!Object.keys(modal).length) ? '' : modal);
	        req.flash('modal-values', (!Object.keys(modal_values).length) ? '' : modal_values);
	        req.flash('alert', (!Object.keys(alert).length) ? '' : alert);

	        var result = new Array(
	        	(!Object.keys(docentes).length) ? new Array() : docentes,
	        	(!Object.keys(categoria_incidencia).length) ? new Array() : categoria_incidencia,
	        	(!Object.keys(periodo).length) ? new Array() : periodo,
	        	(!Object.keys(programa_educativo).length) ? new Array() : programa_educativo
	        );
	        req.flash('results', result);
	        req.flash('content', 'reporte_docente_incidencia');
			return res.redirect('/welcome'); 

	      });

	      });

	      });

	      });
	});
});

module.exports = router;

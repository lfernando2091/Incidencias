var express = require('express');
var router = express.Router();

/*Call Mappers Controller*/
const mappers = require('../../lib/mappers.js');
mappers.loadMapper('/menu/periodo');

/* GET home page. */
router.get('/', function(req, res, next){
	req.getConnection(function(err, connection) {
	      if (err) return next(err);

	      connection.query(mappers.onQuery('periodo', 'catalogo', null), [], function(err, results) {
	        if (err) return next(err); 
	        
			req.flash('results', results);
	        req.flash('content', 'periodo');
			return res.redirect('/welcome'); 

	      });
	      
	});

	
});

module.exports = router;

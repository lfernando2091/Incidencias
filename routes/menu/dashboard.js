var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	req.flash('content', 'dashboard');
	return res.redirect('/welcome'); 
});

module.exports = router;

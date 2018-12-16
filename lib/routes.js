var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
const mappers = require('./lib/mappers.js');
mappers.loadMapper('clientes');
mappers.setNameSpace('clientes');

module.exports = function (app, passport) {
/*
	app.get('/', function (req, res, next) {
        app.use('/', indexRouter);
	}); 
    
    app.get('/users', function (req, res, next) {		
        app.use('/users', usersRouter);
	}); 
*/
    app.use('/', indexRouter);
    
    app.use('/users', usersRouter);
    
    /*Check Authentications*/
    app.use(function(req, res, next) {
	    // don't serve /secure to those not logged in
        // you should add to this list, for each and every secure url
        if (req.url === '/welcome' && (!req.session || !req.session.authenticated || !req.isAuthenticated())) {
            res.render('./login/unauthorised', { status: 403, title: 'No autorizado' });
            return;
        }
        next();
    });
    
	app.get('/welcome', function (req, res, next) {
		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.render('./login/welcome', {title: 'Bienvenido'});
	});

	app.get('/login', function (req, res, next) {
		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.render('./login/login', { flash: req.flash(), title: 'Login'});
	});

	app.get('/cliente', function (req, res, next) {
		res.render('./login/cliente', { flash: req.flash(), title: 'Cliente'});
	});

	app.post('/cliente', (req, res, next) => {  
		console.log("nombre: " + req.nombre);
		console.log("apellidoPat: " + req.apellidoPat);
		console.log("apellidoMat: " + req.apellidoMat);
		console.log("correo: " + req.correo);

		var param = {
	        nombre : req.body.username,
	        apellidoPat : req.body.username,
	        apellidoMat: req.body.password,
	        correo : req.body.correo
	    } 
		req.getConnection(function(err, connection) {
	      if (err) return next(err);
	      connection.query(mappers.onQuery('insertClient',param), [], function(err, results) {
	        if (err) return next(err);	 
	        return res.redirect('/login'); 
	    });
	}

/*
usr - root
pass - admin
hash - $2a$10$Z4lMjOGbutYsCE79qrnluun1ibs7fcxen.p7843qdhKS78NZEr/x6
*/

	app.post('/login', (req, res, next) => {  
		console.log("username: " + req.username);
		console.log("password: " +req.password);
		passport.authenticate('local', (err, user, info) => {
			console.log(user);
			if (err) { return next(err); }
    		if (!user) { return res.redirect('/login'); }
			    req.login(user, (err) => {
			      	//console.log('req.session.passport:'+ JSON.stringify(req.session.passport))
		    		//console.log('req.user:'+JSON.stringify(req.user))
			      	if (err) 
			      		return next(err);
			      	req.session.authenticated = true;
      				return res.redirect('/welcome');
			    });
		  	})(req, res, next);

/*Old Code
		// you might like to do a database look-up or something more scalable here
		if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
			req.session.authenticated = true;
			res.redirect('/welcome');
		} else {
			req.flash('error', 'Username and password are incorrect');
			res.redirect('/login');
		}
*/
	});


	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		req.logout();
		res.redirect('/');
	});

};
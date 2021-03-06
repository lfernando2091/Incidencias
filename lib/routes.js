//SET DEBUG=Incidencias:* & npm run devstart
const indexRouter = require('../routes/index');

const usersRouter = require('../routes/users');

const dashboardRouter = require('../routes/menu/dashboard');

const periodoRouter = require('../routes/menu/periodo');

const criterioRouter = require('../routes/menu/criterio');

const programaEducativoRouter = require('../routes/menu/programa_educativo');

const categoriaIncidenciaRouter = require('../routes/menu/categoria_incidencia');

const docenteRouter = require('../routes/menu/docente');

const usuarioRouter = require('../routes/menu/usuario');

const docenteIncidenciaRouter = require('../routes/menu/docente_incidencia');

const perfilRouter = require('../routes/menu/perfil');

const docenteCalificacionRouter = require('../routes/menu/docente_calificacion');

const docenteCalificacionCriterioRouter = require('../routes/menu/docente_calificacion_criterio');

const reporteIncidenciasRouter = require('../routes/reporte/incidencias');

const reporteCalificacionesRouter = require('../routes/reporte/calificaciones');

/*Call Mappers Controller*/
const mappers = require('./mappers.js');
mappers.loadMapper('usuario');
/**
 * Express bcrypt for sometext
 */
const bcrypt = require('bcrypt-nodejs');
/*Config Options For Routes*/
const routes = require('../config-routes.json');

module.exports = function (app, passport) {

    app.use('/', indexRouter);
    
    app.use('/users', usersRouter);

    app.use('/dashboard', dashboardRouter);

    app.use('/periodo', periodoRouter);

    app.use('/criterio', criterioRouter);

    app.use('/programa_educativo', programaEducativoRouter);

    app.use('/categoria_incidencia', categoriaIncidenciaRouter);

    app.use('/docente', docenteRouter);

    app.use('/usuario', usuarioRouter);

    app.use('/docente_incidencia', docenteIncidenciaRouter);

    app.use('/perfil', perfilRouter);

    app.use('/docente_calificacion', docenteCalificacionRouter);

    app.use('/docente_calificacion_criterio', docenteCalificacionCriterioRouter);

    app.use('/reporte_docente_incidencia', reporteIncidenciasRouter);

    app.use('/reporte_calificaciones', reporteCalificacionesRouter);
    
    /*Check Authentications*/
    app.use(function(req, res, next) {
    	//res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
	    // don't serve /secure to those not logged in
        // you should add to this list, for each and every secure url
		for (i = 0; i < routes.auth.length; i++) 
			if (req.url === routes.auth[i] && (!req.session || !req.session.authenticated || !req.isAuthenticated()))
            	return res.render('./403', { status: 403, title: 'No autorizado' });  
		
		next();              
    });
    
	app.get('/welcome', function (req, res, next) {
		var content = req.flash("content");
		if(content == 'dashboard' || content == ''){
			console.log('dashboard');
		}
		//res.set('Cache-Control', 'public, max-age=300, s-maxage=600');	
		res.render('./welcome', {
			title: 'Bienvenido', 
			user: req.user.Usuario, 
			email: req.user.Email, 
			type: req.user.Tipo, 
			content: content, 
			results: req.flash("results"), 
			mensaje: req.flash("mensaje"),
			alert: req.flash("alert"),
			modal: req.flash("modal")[0], 
			modal_values: req.flash("modal-values")[0], 
			csrfToken: req.csrfToken()
		});
	});

	app.get('/signup', function (req, res, next) {		
		var user = req.flash("user");
		var email = req.flash("email");
		var error = req.flash("error");
		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.render('./login/signup', {flash: error, title: 'Signup', username: user[0], email: email[0], csrfToken: req.csrfToken()});
	});

	app.post('/signup', (req, res, next) => {  
		var param = { 
	        usuario : req.body.username,
	        email : req.body.email,
	        pass: req.body.password,
	        token : ''
	    } 
	    if(req.body.username == '' || req.body.email == '' || req.body.password == '' || req.body.repassword == '')
	    {
	    	req.flash('error', 'Uno o más campos estan vacios');
	    	req.flash('user', req.body.username);
		    req.flash('email', req.body.email);
	    	return res.redirect('/signup');	
	    }
	    else
	    {
		    if(req.body.password != req.body.repassword){
		    	req.flash('error', 'Verifica los campos');
		    	req.flash('error', 'Los passwords no coinciden');
		    	req.flash('user', req.body.username);
		    	req.flash('email', req.body.email);
				return res.redirect('/signup');		    
		    }
		}
		req.getConnection(function(err, connection) {
	      if (err) return next(err);
	      param.token = bcrypt.hashSync(param.pass);
	      connection.query(mappers.onQuery('usuario', 'agregarUsuario',param), [], function(err, results) {
	        if (err) return next(err);	 
	        return res.redirect('/login'); 
	      });
	      
	    });
	});

	app.get('/login', function (req, res, next) {
		if(req.session.authenticated && req.isAuthenticated()){
			req.flash('content', 'dashboard');
			res.redirect('/welcome'); 		
		}
		else{
			var error = req.flash("error");
			res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
			res.render('./login/login', {flash: error, title: 'Login', csrfToken: req.csrfToken()});
		}
	});

	app.post('/login', (req, res, next) => {  
		passport.authenticate('local', (err, user, info) => {
			if (err) { return next(err); }
    		if (!user) { 
    			req.flash('error', info.message);
    			return res.redirect('/login'); 
    		}
			    req.login(user, (err) => {
			      	//console.log('req.session.passport:'+ JSON.stringify(req.session.passport))
		    		//console.log('req.user:'+JSON.stringify(req.user))
			      	if (err) 
			      		return next(err);
			      	req.session.authenticated = true;
			      	req.flash('content', 'dashboard');
      				return res.redirect('/welcome');
			    });
		  	})(req, res, next); 
	});


	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		req.logout();
		res.redirect('/');
	});

};
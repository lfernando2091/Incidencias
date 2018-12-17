const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('app --> ');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
/*Call Mappers Controller*/
const mappers = require('./lib/mappers.js');
mappers.loadMapper('login');
mappers.setNameSpace('login');

/**
 * Express bcrypt for sometext
 */
const bcrypt = require('bcrypt-nodejs');
/**
 * Express Passport Controller
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
/**
 * Express UUID creator
 */
const uuid = require('uuid/v4');
/**
 * Express Session Controller
 */
const session = require('express-session');
/**
 * Express Grant Middleware Controller
 */
const grant = require('grant-express');
/**
 * Express MySql Middleware Session saver
 */
const MySQLStore = require('express-mysql-session')(session);
/**
 * Express MySql
 */
const MySql = require('mysql');
/**
 * Express MySql Middleware
 */
const MySqlConnection = require('express-myconnection');

const expressValidator = require('express-validator');

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
const flash = require('express-flash');

/*Config Options For Grant*/
const config = require('./config-grant.json');

/*Config Options For MySql Connection*/
const options = require('./config-db-options.json');

/*"ssl": {},*/
/*options.ssl =
{
    cat: fs.readFileSync(__dirname + '/certs/old-server-ca.pem'),
    key: fs.readFileSync(__dirname + '/certs/client-key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/client-cert.pem')
}*/

const sessionStore = new MySQLStore(options);

var app = express();

const secretKey = 'secret-key-api-change-in-production';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(expressValidator());

/*Set middleware for Mysql Connection*/
app.use(MySqlConnection(MySql, options, 'single'));

// REQUIRED: any session store - see /examples/express-session-stores
app.use(
    session(
        {
            store: sessionStore,
            key: 'mitienda',
            secret: secretKey, 
            genid: (req) => {
              return uuid() // use UUIDs for session IDs
            },
            saveUninitialized: true, 
            resave: true
        }
    ));
// mount grant
app.use(grant(config));
/**
 * Express Passport Settings
 */ 
var users = new Array();

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    // Load hash from your password DB.
    //bcrypt.compare("bacon", hash, function(err, res) {
        // res == true
    //});
    // SQL Parameters
    var param = {
        usuario : username
    } 
    // create the connection to database
    MySql.createConnection(options).query(mappers.onQuery('authenticate',param), function (error, results, fields) {
        if (error) return done(err); 
        users = results;      
        if (results.length==0)
          return done(null, false, { message: 'Usuario no registrado.' }); 
        if(!bcrypt.compareSync(password, results[0].Token)) 
          return done(null, false, { message: 'Incorrect username o password.' }); 
        return done(null, results[0]);             
    });    
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.Id);
});


passport.deserializeUser(function(id, done) {
  // SQL Parameters
  var user;
  if(users.length>0)
    user = users[0].Id === id ? users[0] : false; 
  else 
    user = false;
  done(null, user);
  //User.findById(id, function(err, user) {
  //  done(err, user);
  //});

});

app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

/*Call to router Controller*/
require('./lib/routes.js')(app, passport);

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

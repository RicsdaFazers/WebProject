const app = require('./server.js');
const router = require('./routes/routeM.js');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const models = require("./models/");
const expressValidator = require('express-validator'); 

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
    secret: 'centroOperacoes',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 60000,
      httpOnly: true,
    }
  }));

   app.use(function(req, res, next) {
    // check if session exists
    if (global.sessData === undefined) {
      global.sessData = req.session;
      global.sessData.ID = req.sessionID;
    }
    else { // yes, cookie was already present
      console.log('session exists', global.sessData.ID);
    }
    next();
  }); 
  
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  require('./routes/auth.route.js')(app, passport);
  require('./config/passport/passport.js')(passport, models.user);
  //Sync Database
  models.sequelize.sync().then(function() {
    console.log('A Base de Dados está de roda no ar!');
  
  }).catch(function(err) {
    console.log(err, "Algo de errado nao esta certo com a Base de Dados");
  });

//importar as rotas
app.use('/', router);
module.exports = app;
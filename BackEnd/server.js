const express = require("express");

const hostname = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

//carregar bibliotecas
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
//const expressValidator = require('express-validator');
const { body } = require("express-validator");

//iniciar aplicação
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
//app.use(expressValidator());
app.use(express.json());

//forçar uso de bibliotecas
app.use(
  cors({
    exposedHeaders: ["Location"],
  })
);

app.use("/assets", express.static("assets"));
app.use("/views", express.static("views"));
app.listen(port, function (err) {
  if (!err) {
    console.log(`Server running at http://${hostname}:${port}/`);
  } else {
    console.log(err);
  }
});

/* //LOGIN
app.use(session ( {
    secret: 'secret key',
    resave: true,
    saveUninitialized: true 

}));
app.use(passport.initialize());
app.use(passport.session());

app.post ('/login',
passport.authenticate('local', {successRedirect: '/', 
 failureRedirect: '/login',
 failureFlash: true
})); */

// criar um loader
module.exports = app;
require("./loader.js");

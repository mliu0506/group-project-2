//require("dotenv").config();
var express = require("express");
var Sequelize = require("sequelize");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var passport = require("passport");
var session = require("express-session");
var mysql2 = require("mysql2");
var db = require("./models");
var path = require("path");
var favicon = require("serve-favicon");
var env = "secret";
var config = require(__dirname + "/config/config.json")[env];
console.log(config.use_secret);

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

//session use
app.use(
  session({
    secret: config.use_secret,
    resave: true,
    saveUninitialized: true
  })
); // session secret

//passport
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.set("views", "./views/");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

//importing passport file
require("./config/passport/passport.js")(passport, db.User);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

module.exports = app;

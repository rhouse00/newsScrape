// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Our scraping tools
const cheerio = require("cheerio");
const request = require("request");

// Initialize Express
const app = express();

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// handlebars
app.use(express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Static directory
// app.use(express.static("./public"));


// ============================== Routes ==============================
require("./controllers/controller.js")(app);


// =================== Database configuration with mongoose connecting to Heroku ===================

    // production
mongoose.connect('mongodb://heroku_01q4ngzf:87dd0o4i016rs0frtav4gj0cr5@ds157667.mlab.com:57667/heroku_01q4ngzf');

    // Development
// mongoose.connect("mongodb://localhost/newsScrape");
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
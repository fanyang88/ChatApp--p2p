var express = require("express");
var morgan = require("morgan");
var session = require("express-session");
var mongoose = require("mongoose");
var passport= require("passport");
var flash = require("connect-flash");
var bodyParser= require("body-parser");

var fs = require('fs');
var path = require('path');
var io = require('socket.io');
var static = require('node-static');

var http = require('http');
var MongoStore = require('connect-mongo')(session);
mongoose.connect("mongodb://127.0.0.1:27017/chat");
require("./config/passport.js")(passport);

var app= express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan("dev")); 
app.use(bodyParser.urlencoded({extended: false}));   
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: "keycode", 
				saveUninitialized: true,  
				resave: true,  
				store: new MongoStore({ 
				mongooseConnection: mongoose.connection,
				ttl : 10*60})}));  

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//app.set("view engine", "ejs");
require("./routes/route.js")(app, passport);
var port = process.env.PORT || 7000;

var server = app.listen(port);
require("./config/socket.io.js")(app, server);

console.log("server is runinng on: "+port);


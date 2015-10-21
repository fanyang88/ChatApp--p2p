var User = require("../model/user").User;
var Token = require("../model/user").Token;
var Message = require("../model/message");

module.exports = function(app, passport, messageBus){

	app.get("/", function(req, res){
		res.render("index.ejs");
	});

	app.get("/signup", function(req, res){
		res.render("signup.ejs", {message: req.flash("signupMsg")});
	});


	app.post("/signup", passport.authenticate("local-signup", {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));


	app.get("/login", function(req, res){
		res.render("login.ejs", {message: req.flash("loginMsg")});
	});

	app.post("/login", passport.authenticate("local-login", {
		successRedirect : '/contact',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get("/contact", isLogged, function(req, res){

	User.findOne({_id : req.user._id}).exec(function(err, user){
			if(err)
				throw err;
			else{
					res.render('contact.ejs', {
      							user: req.user,
      							contacts: user.contacts
      							});
    					
			}
	});
	});

	//list all user except me
	//{_id : req.user._id}
	app.get("/addContact", isLogged, function(req, res){
			User.find({ _id: {$ne: req.user._id } }).exec(function(err, users){
			if(err)
				throw err;
			else{
					//req.user = user;  //the key!!!
					res.render('addcontact.ejs', {
      							users: users,
      							});
    					
			}
	});
	});

//don't forget to add double-side
	app.get("/addContact/:id/:name", isLogged, function(req, res){
			User.update({_id: req.user._id}, 
				{$push: { contacts: {id: req.params.id, name: req.params.name}}}, {upsert: true}).exec(function(err){
			if(err)
				throw err;
			else{
					//find the user based on req.params.id
					User.findOne({_id : req.params.id}).exec(function(err, user){
						User.update({_id: user._id}, 
							{$push: { contacts: {id: req.user._id, name: req.user.username}}}, 
							{upsert: true}). exec(function(err){
							if(err)
								throw err,
							res.json({message: "add success"});
						});
					});
			}
	});
	});
	

	app.get("/chat/:name1/:name2", isLogged, function(req, res){
		//var senderName = req.user.username;
		var toName= req.params.name2;
		if(toName=== req.user.username) 
			toName= req.params.name1;

		//get all records sorting by objectId from db and displayed on webpage
		Message.find(  {$or:[ {'sender.name':req.params.name1, 'to.name':req.params.name2}, 
		{'sender.name':req.params.name2, 'to.name':req.params.name1} ] }).sort('_id').exec(function(err, messages){
			if(err)
				throw err;
			res.render("chater.ejs", { senderName: req.user.username,
									toName: toName,
		 							senderId: req.user._id,
		 							messges: messages
		 						});
		});
	});



	//set all wrong /xxx to redirect to homepage
	app.get("/*", function(req, res){
		res.redirect("/");
	});
};

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
var localStrategy= require("passport-local").Strategy;
var User = require("../model/user").User;

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
  		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
  		User.findById(id, function(err, user) {
    	done(err, user);
  		});
	});

	passport.use("local-signup", new localStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'username': email}, function(err, user){
				if(err)
					return done(err);
				if(user)
					return done(null, false, req.flash("signupMsg","user already exist"));
				else{

						var newUser= new User();
						newUser.username = email;
						newUser.password = newUser.encrpted(password);
						newUser.save(function(err){
							if(err) 
								return done(err);
							else{
								return done(null, newUser);
							}
							
						});
				}
			});
		});
	}));

	passport.use("local-login", new localStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done){
		 process.nextTick(function(){
		 	User.findOne({"username" : email}, function(err, user){
		 		if(err)  
		 			return done(err);
		 		if(!user)
		 			return done(null, false, req.flash("loginMsg", "no user found"));
		 		if(!user.isEqual(password))
		 			return done(null, false, req.flash("loginMsg", "password incorrect"));
		 		else
		 			return done(null, user);
		 	});
		 });
	}));

	
}

var bcrypt= require("bcrypt");
var mongoose = require("mongoose");
var randtoken =require("rand-token");
var Schema = mongoose.Schema;

var userSchema= mongoose.Schema({
		username : String,
		password : String,

		contacts : [
				{id: String, name: String},
		]	
});


userSchema.methods.encrpted = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.isEqual = function(password){
	return bcrypt.compareSync(password, this.password);
};


var User= mongoose.model("User", userSchema);
var Models= {User : User};
module.exports = Models;

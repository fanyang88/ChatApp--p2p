var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
	sender: {id: String, name : String},  
	to : {id: String, name : String},
	content: String,
	type: String,
	date: { type: Date, 
			default: Date.now()
		}
});

module.exports= mongoose.model("Message", messageSchema);
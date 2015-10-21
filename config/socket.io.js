var User = require("../model/user").User;
var Message = require("../model/message");
var fs = require('fs');


module.exports = function(app, server) {
	var io = require('socket.io').listen(server);

	io.on('connection', function (socket) {
		console.log("socket id: %s", socket.id);

		 socket.on('chat image', function (data) {
		
      		User.findOne({'username': data.toName}, function(err, user){
				if(err)
					throw err;

					var newMsg = new Message();
					newMsg.sender.id= data.senderId;
					newMsg.sender.name= data.senderName;
					newMsg.to.id= user._id;
					newMsg.to.name= data.toName;
					newMsg.content= data.msg;
					newMsg.type= "image";
					newMsg.save(function(err){
						if(err)
							throw err;
					});
			});
      		io.emit('chat image', data);
    	});


		socket.on('chat message', function(data){

			User.findOne({'username': data.toName}, function(err, user){
				if(err)
					throw err;

					var newMsg = new Message();
					newMsg.sender.id= data.senderId;
					newMsg.sender.name= data.senderName;
					newMsg.to.id= user._id;
					newMsg.to.name= data.toName;
					newMsg.content= data.msg;
					newMsg.type= "text";
					newMsg.save(function(err){
						if(err)
							throw err;
					});
			});
			io.emit('chat message', data);
 	 });
	
	});
}



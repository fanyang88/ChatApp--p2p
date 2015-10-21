var socket = io();


 socket.on('chat message', function(data){
        $('#messages').append($('<li>').append($('<p>').text(data.senderName+":"), data.msg));

      });

   socket.on('chat image', function(data) {
    $('#messages').append($('<p>').append($('<b>').text(data.senderName), '<img src="' + data.msg + '"/>'));
  });

 $(function () {

 	var senderName = $('#senderName').text();
 	var toName = $('#toName').text();
 	var senderId= $('#senderId').text();

 	$('form').submit(function(e){
 		e.preventDefault();
 		
        socket.emit('chat message', {msg: $('#m').val(), toName: toName, senderName: senderName, senderId: senderId});

        $('#m').val('');
        return false;
      });


 	$('#imagefile').bind('change', function(e){
 		e.preventDefault();

      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
      socket.emit('chat image', {msg: evt.target.result, toName: toName, senderName: senderName, senderId: senderId});
      };
      reader.readAsDataURL(data);
      $('#imagefile').val('');
    });

   });



      


     
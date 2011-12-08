/*
*  Author: Fabrizio Codello
*  Name: Testing a simple chat system with private messages
*
*/

$(document).ready(function() {
	var chat, //main handle
		json = JSON.stringify,		
		socket = new io.connect('http://localhost');
	
	var chatLog = $("#chatLog ul"),
		chatMsg = $("#chatMsg"),
		status = $("#status"),
		nick = $("#nick");
		users = $("#users ul"),
		online = $("#online"),
		tot = $("#tot"),
		selected = $("#selected"),
		broadcast = $("#broadcast");
		
	status.html("Connecting.");
	chatMsg.focus();
	
	chatMsg.keydown(function(e) {
		if (e.keyCode === 13) { //invio
		
			if (selected.text() == "broadcast") { 
				socket.emit("chat", { msg: chatMsg.val() });
			
			} else { 
				socket.emit("private", { msg: chatMsg.val(), to: selected.text() });
			}
			
			chatMsg.val('');
		}
	});
	
	broadcast.bind("click", function() {
		selected.html('broadcast');
	});

	/* 
	* Socket stuff	
	*/
	    
    socket.on('connect', function() {
    	status.html("Connected.");
	});
			
	socket.on('disconnect', function() {
		status.html("Disconnected.");
	});
	
	 socket.on('nick', function(data) {
    	nick.html("You are: "+ data.nick);
	});
	
	socket.on("tot", function(data) {	
		tot.html(data.tot);
	});
	
	socket.on("users", function(data) {
		users.html('');
		data.users.forEach(function(sessid) {
			users.append('<li><a class="userNick" href="#" title="Send a private message to this user">'+ sessid +'</a></li>');
		});
		$('.userNick').bind("click", function() {
			selected.html($(this).text());
		});
	});

	socket.on("chat", function(data) {	
		chatLog.append('<li><strong>'+ data.from +'</strong>: '+ data.msg +'</li>');
	});
	
	socket.on("private", function(data) {	
		chatLog.append('<li class="private"><em><strong>'+ data.from +' -> '+ data.to +'</strong>: '+ data.msg +'</em></li>');
	});
});

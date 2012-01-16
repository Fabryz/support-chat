var http = require('http'),
    express = require('express');

/*
* HTTP Server
*/

var app = express.createServer();

app.use(express.logger(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(express.static(__dirname + '/public'));
app.use(express.favicon());

app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('index.html');
});

app.listen(8080);

console.log('Server started with Node '+ process.version +', platform '+ process.platform +'.');

/*
* Web Sockets
*/

var io = require('socket.io').listen(app),
	users = [],
 	totUsers = 0;
	
io.configure(function(){ 
	io.enable('browser client minification');
	//io.enable('browser client etag'); 
	io.set('log level', 1); 
	io.set('transports', [ 
			'websocket',
			'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling'
	]);
}); 


var chat = io.sockets.on('connection', function(client) {

	users.push(client.id);

	totUsers++;
	console.log('+ New connection from ' + client.handshake.address.address +':'+ client.handshake.address.port);
	console.log('+ User '+ client.id +' connected, total users: '+ totUsers);
	
	client.emit("nick", { nick: client.id });
	io.sockets.emit("tot", { tot: totUsers });
	io.sockets.emit("users", { users: users });
	
	client.on("chat", function(data) {		
		//console.dir(data);
		io.sockets.emit("chat", { from: client.id, msg: data.msg });
	});
	
	client.on("private", function(data) {		
		//console.dir(data);
		io.sockets.sockets[data.to].emit("private", { from: client.id, to: data.to, msg: data.msg });
		client.emit("private", { from: client.id, to: data.to, msg: data.msg });
	});

	client.on('disconnect', function() {
		var length = users.length;
		for(var i = 0; i < length; i++) {
			if (users[i] === client.id) {
				users.splice(i, 1);
				break;
			}
		}

		totUsers--;
		io.sockets.emit("tot", { tot: totUsers });
		io.sockets.emit("users", { users: users });
		console.log('- User '+ client.id +' disconnected, total users: '+ totUsers);
	});
});


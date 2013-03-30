/*
* Express
*/

var express = require('express'),
    socketio = require('socket.io'),
    http = require('http'),
    path = require('path');

var app = express();

// Configuration

app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.use(express.favicon());
    app.use(express.logger('short'));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port "+ app.get('port') +" in "+ app.get('env') +" mode.");
});

/*
* Socket.IO
*/

var io = socketio.listen(server);

io.configure(function() {
    io.enable('browser client minification');
    io.set('log level', 1);
});

var users = [];

io.sockets.on('connection', function(client) {

    users.push(client.id);
    console.log('+ User '+ client.id +' connected ('+ client.handshake.address.address +'). Total users: '+ users.length );

    client.emit("nick", { nick: client.id });
    io.sockets.emit("users", { users: users });

    client.on("chat", function(data) {
        io.sockets.emit("chat", { from: client.id, msg: data.msg });
    });

    client.on("private", function(data) {
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

        io.sockets.emit("users", { users: users });
        console.log('- User '+ client.id +' disconnected ('+ client.handshake.address.address +'). Total users: '+ users.length );
    });
});


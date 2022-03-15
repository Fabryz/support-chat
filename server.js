/*
* Support Chat
*/

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const util = require('util');

// Vars

const port = process.env.PORT || 8080;

// Express

const express = require('express'); // FIXME
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

// Websockets

http.listen(port, () => {
  console.log(util.format('Socket.IO server running at http://localhost:%s', port));
});

// Main

let users = [];

io.on('connection', (socket) => {
  users.push(socket.id);

  console.log(util.format('+ User "%s" connected. Total users: %s', socket.id, users.length));

  socket.emit('nick', {
    nick: socket.id,
  });
  io.emit('users', { users });

  socket.on('chat-everyone', (data) => {
    io.emit('chat-everyone', {
      from: socket.id,
      msg: data.msg,
    });
  });

  socket.on('chat-private', (data) => {
    const payload = {
      from: socket.id,
      to: data.to,
      msg: data.msg
    };

    io.to(data.to).emit('chat-private', payload);

    socket.emit('chat-private', payload);
  });

  socket.on('disconnect', () => {
    const index = users.indexOf(socket.id);
    if (index > -1) {
      users.splice(index, 1);
    }

    io.sockets.emit('users', { users });
    console.log(util.format('- User "%s" disconnected. Total users: %s', socket.id, users.length));
  });
});


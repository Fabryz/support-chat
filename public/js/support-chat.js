/*
* Support chat: A simple chat system with private messages, using Node.js and Socket.io
* Author: Fabrizio Codello
*/

// VARS

let socket = new io();

let supportChat = $("#support-chat");
let messagesWr = supportChat.find("#messages");
let messages = supportChat.find("#messages ul");
let chatInput = supportChat.find("#chatInput");
let status = supportChat.find("#status");
let nick = supportChat.find("#nick");
let users = supportChat.find("#users ul");
let total = supportChat.find("#total");
let selected = supportChat.find("#selected");
let everyone = supportChat.find("#everyone");

let userId = null;
let chatToEveryone = true;

// FUNCTIONS

const init = () => {
  chatInput.focus();

  // Handle the user typing in the input field
  chatInput.keydown((e) => {
    if (e.keyCode === 13) { // Enter
      if (chatInput.val()) {
        if (chatToEveryone) {
          socket.emit("chat-everyone", {
            msg: chatInput.val(),
          });
        } else {
          socket.emit("chat-private", {
            msg: chatInput.val(),
            to: selected.text(),
          });
        }

        chatInput.val(''); // Clear the field after the message is sent
      }
    }
  });

  everyone.on('click', () => {
    chatToEveryone = true;
    selected.html('Everyone');
    $('#everyone').hide();
    chatInput.focus();
  });
}

// If n < 10, add a leading 0
const pad = (n) => {
  return ( n < 10 ? '0' + n : n);
}

// Returns a string in the format hh:mm:ss
const getCurrentTime = () => {
  const currentDate = new Date();

  return pad(currentDate.getHours()) +":"+ pad(currentDate.getMinutes()) +":"+ pad(currentDate.getSeconds());
}

// Appends a message to the message list
// have a different style for private messages
const addToMessages = (message) => {
  let time = getCurrentTime();

  if (message.isPrivate) {
    messages.append('<li class="private">['+ time +'] <em><strong>'+ message.from +'</strong>: '+ message.msg +'</em></li>');
  } else {
    messages.append('<li>['+ time +'] <strong>'+ message.from +'</strong>: '+ message.msg +'</li>');
  }

  // scroll down the message list automatically
  messagesWr.prop('scrollTop', messagesWr.prop('scrollHeight'));
}

// MAIN

$(document).ready(() => {
  init();

  socket.on('connect', () => {
    status.html('Connected.');
    console.log('Connected.');
  });

  socket.on('disconnect', () => {
    status.html('Disconnected.');
    console.log('Disconnected.');
  });

  // User receives his new nickname
  socket.on('nick', (data) => {
    userId = data.nick;

    nick.html(userId);
    console.log('Your nickname is: ' + userId);
  });

  // User receives the updated users list
  socket.on('users', (data) => {
    users.html('');
    total.html(data.users.length);

    data.users.forEach((nickname) => {
      if (nickname === userId) {
        users.append('<li><a class="userNick" href="#" data-userid="'+ nickname +'" title="That\'s you!">'+ nickname +' (You)</a></li>');
      } else {
        users.append('<li><a class="userNick" href="#" data-userid="'+ nickname +'" title="Click to send a private message to this user">'+ nickname +'</a></li>');
      }
    });

    // Handle the click on nicknames
    $('.userNick').on('click', (e) => {
      e.preventDefault();

      if ($(e.target).data('userid') !== userId) {
        chatToEveryone = false;
        selected.html($(e.target).text());
        $('#everyone').show();
      }

      chatInput.focus();
    });
  });

  // A new message for everyone has arrived
  socket.on('chat-everyone', (data) => {
    addToMessages({
      from: data.from,
      msg: data.msg
    });
  });

  // A new private message has arrived
  socket.on('chat-private', (data) => {
    addToMessages({
      from: data.from,
      msg: data.msg,
      isPrivate: true
    });
  });
});

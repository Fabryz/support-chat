/*
* Support chat: A simple chat system with private messages, using Node.js and Socket.io
* Author: Fabrizio Codello
*/

$(document).ready(function() {
    var socket = new io.connect('http://localhost:8080');

    var supportChat = $("#support-chat"),
        messages = supportChat.find("#messages ul"),
        chatInput = supportChat.find("#chatInput"),
        status = supportChat.find("#status"),
        nick = supportChat.find("#nick");
        users = supportChat.find("#users ul"),
        online = supportChat.find("#online"),
        total = supportChat.find("#total"),
        selected = supportChat.find("#selected"),
        broadcast = supportChat.find("#broadcast");

    init();

    function init() {
        chatInput.focus();

        chatInput.keydown(function(e) {
            if (e.keyCode === 13) { // Enter

                if (selected.text() == "broadcast") {
                    socket.emit("chat", { msg: chatInput.val() });
                } else {
                    socket.emit("private", { msg: chatInput.val(), to: selected.text() });
                }

                chatInput.val('');
            }
        });

        broadcast.bind("click", function() {
            selected.html('broadcast');
            chatInput.focus();
        });
    }

    function writeMessage(message) {
        var currentDate = new Date(),
            time = currentDate.getHours() +":"+ currentDate.getMinutes() +":"+ currentDate.getSeconds();

        if (! message.isPrivate) {
            messages.append('<li>['+ time +'] <strong>'+ message.from +'</strong>: '+ message.msg +'</li>');
        } else {
            messages.append('<li class="private">['+ time +'] <em><strong>'+ message.from +'</strong>: '+ message.msg +'</em></li>');
        }
    }

    /*
    * WebSocket Events
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

    socket.on("users", function(data) {
        users.html('');
        data.users.forEach(function(nickname) {
            users.append('<li><a class="userNick" href="#" title="Send a private message to this user">'+ nickname +'</a></li>');
        });

        $('.userNick').on("click", function() {
            selected.html($(this).text());
            chatInput.focus();
        });

        total.html(data.users.length);
    });

    socket.on("chat", function(data) {
        writeMessage({ from: data.from, msg: data.msg });
    });

    socket.on("private", function(data) {
        writeMessage({ from: data.from, msg: data.msg, isPrivate: true });
    });
});

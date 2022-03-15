Support chat
============

A simple chat system with private messages, using Node.js and Socket.io.

**Note:** This project is meant for educational purposes and is not production safe.

Features
------------

* Realtime user join/quit events
* Chat with everyone or private chat with a single user
* Connected users list
* Anonymous usernames

![Support Chat](https://i.imgur.com/d9WxilA.png "Support Chat")

Requirements
------------

* [Node.js v14](http://nodejs.org/)
* [Npm](http://npmjs.org/)
* [NVM](https://github.com/nvm-sh/nvm) (optional)

Modules:

* [Socket.io v4](http://socket.io/)
* [Express v4](http://expressjs.com/)
* [Nodemon](https://nodemon.io/) (development module)

How to install
--------------

1. Clone the repository with:

       $ git clone git://github.com/Fabryz/support-chat.git
2. Install dependencies:

       $ cd support-chat
       $ nvm use # only if you have NVM
       $ npm install
3. Start the server:

       $ npm run start
       or
       $ npm run start:dev
5. Point your browser to ``http://localhost:8080/`` and open some more tabs.
6. Your support chat is ready!

License
-------

MIT License

Copyright (c) 2022 Fabrizio Codello

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

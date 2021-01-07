const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
require('dotenv').config();
const users = [];

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

  socket.emit('message', { username: "Bot", message: "Welcome to chatbox" });

  // Getting details of new user from client
  socket.on("userJoin", username => {
    users.push({ id: socket.id, username: username });
    socket.broadcast.emit('message', { username: "Bot", message: `${username} has joined the chat` });
    io.emit("updateUsers", users);
  });

  // when the socket disconnets
  socket.on('disconnect', () => {
    const index = users.findIndex(user => user.id === socket.id);
    socket.broadcast.emit('message', { username: "Bot", message: `${users[index] != null ? users[index].username : null} has left the chat` });
    users.splice(index, 1);
    io.emit("updateUsers", users);
  });

  //  Getting chat messages of user from client
  socket.on("chatMessage", msg => {
    io.emit('message', { username: msg.username, message: msg.message });
  });

});


let server = http.listen(port, () => console.log(`Server Running at port ${port}`));


if (process.env.NODE_ENV === 'testing') {
  console.log('will kill the server after 30sec')
  setTimeout(() => {
    server.close()
  }, 60000);

}

exports.server = server
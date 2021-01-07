// Socket io on client side
const socket = io();

// Refer to chatbox.html & open it in browser to know what they represent
const usersList = document.querySelector(".users-name");
const chatForm = document.getElementById("message-form");
const messageInput = document.querySelector("#msg");
const messages = document.querySelector(".messages"); 

// Getting username from index.html, here qs is a library to parse querystring in url 
const {username} = Qs.parse(location.search, {ignoreQueryPrefix: true});



/////////////////////// IMPLEMENT BELOW STEPS //////////////////////

// Send username about "userJoin" to server 

socket.emit("userJoin", username);

// Listen for "updateUsers" from server and update usersList with new list of users, each user should be a li element containing username.

socket.on("updateUsers", (users) => {
  usersList.innerHTML = "";
  for(let i=0; i<users.length; i++){
    const li = document.createElement("li");
    li.innerHTML = `${users[i].username}`;
    document.querySelector(".users-name").appendChild(li);
  }
});

// Listen for "message" from server and add new msg to messages, each message is a div element with class "message" 
// containing 2 paragraphs, one with class "meta" containing username & other with class "text" containing message.
socket.on('message', msg=>{
  const NewDiv = document.createElement('div');
  NewDiv.innerHTML = 
  `<p class="meta">${msg.username}</p>
  <p class="text">${msg.message}</p>`;
  NewDiv.classList.add("message");
  messages.appendChild(NewDiv);
  messages.scrollTop = messages.scrollHeight;
})

// When a user submit a message in chatForm send {username: username, message: messageInput.value } about chatMessage to server 
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  socket.emit('chatMessage', {username: username, message: inputField.value });
  inputField.value = "";
})
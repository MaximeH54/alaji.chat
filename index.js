const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const escapeHtml = require('escape-html')
app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

function sendClients () {
  const clients = []
  const connected = io.sockets.clients().connected
  for (const index in connected) {
    const client = connected[index]
    clients.push({
      avatar: escapeHtml(client.handshake.query.avatar),
      pseudo: escapeHtml(client.handshake.query.pseudo)
    })
    console.log(clients)
  }
  io.emit('clients', clients)
}


const messages = []

io.on('connection', function(socket) {

  const pseudo = escapeHtml(socket.handshake.query.pseudo).substr(0, 30)
  const avatar = escapeHtml(socket.handshake.query.avatar)

  socket.handshake.query.pseudo = pseudo
  socket.handshake.query.avatar = avatar

  console.log(`${pseudo} s'est connecté !`)

  sendClients();
  socket.emit('messages', messages)

  const clients = []
  const connected = io.sockets.clients().connected
  for (const index in connected) {
    const client = connected[index]
    clients.push({
      avatar: client.handshake.query.avatar,
      pseudo: client.handshake.query.pseudo
    })
    console.log(clients)
  }
  io.emit('clients', clients)
  socket.emit('messages', messages)

  socket.on('message', function (value) {

    const data = {
      avatar:avatar,
      pseudo:pseudo,
      message:escapeHtml(value).substr(0, 500),
      date:Date.now()
    }
    messages.push(data)

    io.emit('message', data)
  })
  socket.on('disconnect', function () {
    console.log(`${pseudo} s'est déconnecté !`)
    sendClients();
  })
})

http.listen(3000, function() {
  console.log('http://localhost:3000');
})

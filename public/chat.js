function getHtml (data) {
  if (typeof data === 'string') {
    const div = document.createElement('div')
    div.innerHTML = data
    data = div
  }
  return data
}

function addMessage (data) {
  const date = new Date(data.date)
  const value = `
    <div class="message">
      <div class="avatar">
        <img src="${data.avatar}" width="40px">
      </div>
      <div class="lumière">
        <div class="pseudo">${data.pseudo}</div>
        <div class="date">${date.toLocaleDateString()} à ${date.toLocaleTimeString()}</div>
        <div class="date">

        </div>
        ${data.message}
      </div>
    </div>
    `
  document.getElementById('messages').append(getHtml(value))
}

function addUser (data) {
  const value = `<div>${data.pseudo}`</div>
  document.getElementById('users').append(getHtml(value))
}

function addUser (data) {
  const value = `
  <div class="client">
    <div class="avatar">
      <img src="${data.avatar}" width="40px">
    </div>
      <div class="pseudo">${data.pseudo}</div>
    </div>
  `

  document.getElementById('users').append(getHtml(value))
}

const urlParams = new URLSearchParams(window.location.search)
const pseudo = urlParams.get('pseudo')
const avatar = urlParams.get('avatar')

const socket = io({
  query: {
    pseudo: pseudo,
    avatar: avatar
  }
})

socket.on('clients', function (data) {
  ocument.getElementById('users').innerHTML = ''
  data.forEach(function (client) {
    addUser(client)
  })
})

socket.on('messages', function(data) {
  data.forEach(function (message){
    addMessage(message)
  })
})


socket.on('message', function(value){
  addMessage(value)
})

document.querySelector('[data-avatar]').setAttribute('src', avatar)
document.querySelector('[data-pseudo]').textContent = pseudo

document.getElementById('send').addEventListener('submit', function (e) {
  e.preventDefault()
  const value = this.querySelector('input').value
  if (value) {
    // Send message
    socket.emit('message', value)
    console.log(value)
    this.querySelector('input').value = null
  }
})

#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var multiline = require('multiline')
var file = path.normalize(process.argv[2])


var port = parseInt(process.argv[3], 10)

if (isNaN(port)){
    port = 3000
}

var marked = require('marked');
// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false
// })

fs.watchFile(file, {interval: 50}, update)


var sockets = []

function update(){
    var html = getHTML()

    sockets.forEach(message.bind(this, html))
}

function message(msg, socket){
    socket.emit('update', msg)
}

//start express and socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function getHTML(){
    var text = fs.readFileSync(file,'utf8')
    console.log(text)
    return marked(text)
}

app.get('/', function(req, res){
  res.send(multiline(function(){/*
    <!DOCTYPE html>

<html>
<head>
<script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
<script>
  var socket = io();
  socket.on('update', function(html){
    document.body.innerHTML = html
  })
</script>
</head>
<body>
</body>
</html>

*/}))
});

io.on('connection', function(socket){
  console.log('a user connected')
  message(getHTML(), socket)
  sockets.push(socket)

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
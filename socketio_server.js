var http = require("http");
var url = require('url');
var fs = require('fs');

//////////////udp server
var PORT = 6000;
var HOST = '10.101.1.29';
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
server.on('listening', function () {
var address = server.address();
var msg
console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function (message, remote) {
  msg=message;
  console.log(remote.address + ':' + remote.port +' - ' + message);
});
server.bind(PORT, HOST);

////////////////http server
var server = http.createServer(function(request, response) {
  console.log('Connection');
  var path = url.parse(request.url).pathname;

  switch (path) {
    case '/public/lib/p5.min.js':
    case '/public/sketch.js':
    case '/public/socket.html':
      fs.readFile(__dirname + path, function(error, data) {
        if (error){
          response.writeHead(404);
          response.write("opps this doesn't exist - 404");
        } else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
        }
        response.end();
      });
      break;
    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }
});

///////////////socket.io
const io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
    //socket.emit('message', {'message': 'hello socketio'});
    setInterval(function() {
        socket.emit('message', {'x': msg});
      }, 1000);
});

server.listen(8001);

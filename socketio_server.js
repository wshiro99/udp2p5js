var http = require("http");
var url = require('url');
var fs = require('fs');
var msg;
//var xy=[0,0,0,0,0,0]
//////////////udp server
var PORT = 6000;
var HOST = '10.101.1.29';
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
server.on('listening', function () {
var address = server.address();
console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function (message, remote) {
  //msg=message.toString()
  try{
    msg=message.toString()
    //var hc=message.toString().split(";") 
    //var spliter=hc[0].split(":")  //if only one
    //xy=spliter[1].split(",")  //xy[0~5]
    //id=spliter[0];
  }catch(e){}
  console.log(remote.address + ':' + remote.port +' - ' + msg);//xy[0]+","+xy[1]);
});
server.bind(PORT, HOST);

////////////////http server
var server = http.createServer(function(request, response) {
  console.log('Connection');
  var path = url.parse(request.url).pathname;

  switch (path) {
    case '/public/b_fish/socket.html':
    case '/public/b_fish/sketch.js':
    case '/public/b_snails/socket.html':
    case '/public/b_snails/sketch.js':
    case '/public/d_tangled/socket.html':
    case '/public/d_tangled/sketch.js':
    case '/public/d_superstring/socket.html':
    case '/public/d_superstring/sketch.js':
    case '/public/d_chaosdancer/socket.html':
    case '/public/d_chaosdancer/sketch.js':
    case '/public/d_chaosdancer/canvas.jpg':
    case '/public/e_limbo/socket.html':
    case '/public/e_limbo/sketch.js':
    case '/public/e_nightmare/socket.html':
    case '/public/e_nightmare/sketch.js':
    case '/public/e_sweetdream/socket.html':
    case '/public/e_sweetdream/sketch.js':
    case '/public/f_thesoul/socket.html':
    case '/public/f_thesoul/sketch.js':
    case '/public/g_rollercoaster/socket.html':
    case '/public/g_rollercoaster/sketch.js':
    case '/public/g_loopmountain/socket.html':
    case '/public/g_loopmountain/sketch.js':
    case '/public/h_crazyscore/socket.html':
    case '/public/h_crazyscore/sketch.js':
    case '/public/lib/p5.sound.js':
    case '/public/lib/p5.min.js':
    case '/public/lib/p5.js':
    case '/public/lib/ambilib.js':
    case '/public/controlPanelC.js':
    case '/public/controlPanelC.html':
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
//var messages = 
  //{ x: xy[0], y: xy[1], xSpeed: xy[2], ySpeed: xy[3], xAcc: xy[4], yAcc: xy[5] };

io.sockets.on('connection', function(socket) {
    setInterval(function() {
      socket.emit('message', msg);
      //socket.emit('message', {'x': xy[0], 'y': xy[1], 'xSpeed': xy[2], 'ySpeed': xy[3], 'xAcc': xy[4], 'yAcc': xy[5]});
    }, 100);

/*    socket.on('redirect',function(destination){
      io.sockets.emit('redirect', destination);
    })

    socket.on('wall',function(w){
      io.sockets.emit('wall', w);
    })*/
});

server.listen(8001);

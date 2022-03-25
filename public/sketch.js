var cnv, width, height
var msg

function centerCanvas() {
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x, y);
}
function windowResized() {	
	centerCanvas();
//	resizeCanvas(windowHeight, windowHeight);
}
function setupSocket(){
      var socket = io.connect();
        socket.on('message', function(data) {
        msg=data.x.byteLength;
		print(msg)
      });
}
function setup() {
	if(windowHeight<=windowWidth){
		cnv=createCanvas(windowHeight, windowHeight);
		width=windowHeight
		height=windowHeight
	}
	else{
		cnv=createCanvas(windowWidth, windowWidth);
		width=windowWidth
		height=windowWidth
	}
	centerCanvas();
	setupSocket();
}

function draw() {
	background("blue")
	fill("yellow")
	ellipse(width/2,height/2,width/4)
	fill("black")
	text(msg,width/2,height/2)
}

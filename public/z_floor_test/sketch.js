var newMouseX=[], newMouseY=[]

function setup() {
	
	createCanvas(12336,3188);
	setupSocket("e");
	
	// drawingContext.shadowColor = color(255,50)
	// drawingContext.shadowBlur=100
}
function draw() {
	var ww=5
	background("black");
	for(var i=0;i<width;i+=width/20){
		rect(i,0,ww,height)
		ww+=5
	}
	
	newMouseX=getNewMouseXArray()
	newMouseY=getNewMouseYArray()

	noStroke()
	fill("white")
	for(var i=0;i<newMouseX.length;i++){	
		ellipse(newMouseX[i],newMouseY[i],150)
	}
	
}
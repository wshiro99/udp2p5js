var newMouseX, newMouseY

var colors = "b4b8ab-153243-284b63-f4f9e9-eef0eb".split("-").map(a=>"#"+a)
var fishColors = "eef0eb-2364aa-3da5d9-73bfb8-fec601-ea7317".split("-").map(a=>"#"+a)
function drawFish(fish){
	
	push()
		noStroke()
		translate(fish.p.x,fish.p.y)
		rotate( fish.v.heading()+PI)
		scale(fish.scale || 0.9)
	
		fill(fish.color1)
		beginShape()
			vertex(300,-5)	
			vertex(0,-5)	
			curveVertex(120,35)
		endShape(CLOSE)
	
	
		fill(fish.color2)
		beginShape()
			vertex(300,0)	
			vertex(0,0)	
			curveVertex(100,-40)
		endShape(CLOSE)
		
	
		push()
		stroke(colors[2])
	
	drawingContext.shadowBlur = 0
		for(var i=5;i<25;i+=5){
			rotate(PI/120)
			line(i*4,i,250-8*i,i)
			
		}
		pop()
		
		push()
			fill(colors[4])
			ellipse(50,-10,15)

			fill(colors[1])
			ellipse(48,-10,6)
		pop()
	
	
	let finColor = color(fish.color1)
	finColor.setRed(finColor._getRed()*0.99)
	finColor.setGreen(finColor._getGreen()*0.7)
	finColor.setBlue(finColor._getBlue()*0.7)
		//fin	
	
		fill(finColor)
		push()	
			translate(140,0)
			rotate(sin(fish.p.x/20+fish.p.y/20+frameCount/10)/4)
			beginShape()
			vertex(0,0)	
			vertex(40,-30)	
			curveVertex(35,0)
			vertex(40,30)	
			vertex(0,0)	
			endShape(CLOSE)
		pop()
	
		//tail
		push()
			translate(260,0)
			rotate(sin(fish.p.x/40+fish.p.y/20+PI/2+frameCount/10)/4)
			beginShape()
			vertex(0,0)	
			vertex(60,-50)	
			curveVertex(40,0)
			vertex(60,50)	
			vertex(0,0)	
			endShape(CLOSE)
		pop()	
	pop()
}
let fishArray = []
let bubbles = []
let overAllTexture

/*function setupSocket(wall){
	var socket = io.connect();		
	socket.on('message', function(data) {
		try{
			var o=getWallInfo(wall)
			newMouseY=lerp(newMouseY, map(data.x,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.3)
			newMouseX=lerp(newMouseX, map(data.y,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.3)
			//newMouseY=lerp(newMouseY, map(data.x,38,30,0,2160) ,0.3)
			//newMouseX=lerp(newMouseX, map(data.y,0,10,0,4782) ,0.3)
			print(o)
			//print("x:"+data.x+",y:"+data.y+",ySpeed:"+data.ySpeed)
		}catch(e){
			//newMouseX=width/2
			//newMouseY=height/2
		}
	});
	//socket.on('redirect', function(destination) {
	//	var s = document.createElement("script");
	//	s.type = "text/javascript";
	//	s.src = "./b_snails.js";
	//	s.innerHTML = null;
	//	document.body.appendChild(s);
		//window.location.href = destination;
	//});
}*/
function setup() {
	//createCanvas(800,800);
	createCanvas(windowWidth, windowHeight);
	pixelDensity(1)
	// width=windowHeight
	// height=windowHeight
	background(100);
	setupSocket("c");
	//newMouseX=400//width/2
	//newMouseY=400//height/2
	drawingContext.shadowColor = color(0,50)
	drawingContext.shadowOffsetX = 3
	drawingContext.shadowOffsetY = 3
	// drawingContext.shadowBlur = 10
	
	for(var i=0;i<height;i+=20){
		let c1=random(fishColors)
		let c2 =random( fishColors.filter(c=>c!=c1))
		fishArray.push({
			p: createVector(random(width),i+50),
			v: createVector(random(-1,-3),0),
			scale: random(0.3,1),
			color1: c1,
			color2: c2
		})
	}
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	// noStroke()
	// for(var i=0;i<width+50;i++){
	// 	for(var o=0;o<height+50;o++){
	// 		overAllTexture.set(i,o,color(100,noise(i/3,o/3,i*o/50)*random([0,30,60])))
	// 	}
	// }
	overAllTexture.updatePixels()
}

function draw() {
	newMouseX=getNewMouseX()
	newMouseY=getNewMouseY()
	console.log(newMouseX)
	let waving = mouseIsPressed
	noStroke()
	let stColor = color(39, 121, 229)
	let edColor = color(15, 20, 38)
	for(var i=0;i<height;i+=40){
		push()
			rotate(random(-0.02,0.02))
		let midColor= lerpColor(stColor,edColor,i/height + noise(i,frameCount/100)/5)
		midColor.setAlpha(200)
		fill(midColor)
		rect(-50,i,width+100,80)
		pop()
	}
	
	
	bubbles.forEach(b=>{
		fill(255,b.opacity)
		ellipse(b.p.x + noise(b.p.y/20)*b.r*2,b.p.y,b.r)
		b.p.y+=b.v.y
	})
	fishArray.forEach(fish=>{
		drawFish(fish)
		fish.p.add(fish.v)
		if (fish.p.x<-520){
			fish.p.x=width+300
		}
		if (fish.p.x>width+500){
			fish.p.x=-300
		}
		fish.v=fish.v.add(
			createVector(newMouseX + random(-10,10),newMouseY+ random(-10,10)).sub(fish.p)
								.mult(0.1).limit(waving?0.3:0.15)
		)
		fish.v.mult(0.995)
		
		if (random()<0.03){
			bubbles.push({
				p: fish.p.copy(),
				v: createVector(0,random(-0.5,-5)),
				r: random(1,15),
				opacity: random(0.1,200)
			})
		}
	})
	
	bubbles=bubbles.filter(b=>b.p.y>-50)
	
	push()
		stroke(255)
		translate(newMouseX,0)
		line(0,0,0,newMouseY-50+sin(frameCount/50)*30)
		translate(0,newMouseY-35+sin(frameCount/50)*30)
		strokeWeight(3)
		noFill()
		arc(0,0,15,25,0,PI*1.5)
		translate(0,5)
		strokeWeight(7)
		rotate(PI/8)
		stroke(255, 153, 153)
		beginShape()
		for(var i=0;i<20;i++){
			vertex(i,sin(i/2+frameCount/(waving?5:20) )*3)
		
		}
		endShape()
		
	
		
	pop()
	
	
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
	// ellipse(mouseX, mouseY, 20, 20);
}
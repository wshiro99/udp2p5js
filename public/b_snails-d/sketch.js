var newMouseX, newMouseY

var colors1 = "ff4e00-8ea604-f5bb00-ec9f05-bf3100-b24c63-5438dc-357ded-56eef4-32e875-333".split("-").map(a=>"#"+a)
var colors2 = "ffbe0b-fb5607-ff006e-8338ec-3a86ff-eee".split("-").map(a=>"#"+a)
let snales = []
let overAllTexture
/*function setupSocket(o){
	var socket = io.connect();
	socket.on('message', function(data) {
		try{
			newMouseY=lerp(newMouseY, map(data.x,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.3)
			newMouseX=lerp(newMouseX, map(data.y,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.3)
			//newMouseY=lerp(newMouseY, map(data.x,38,30,0,2160) ,0.3)
			//newMouseX=lerp(newMouseX, map(data.y,0,10,0,4782) ,0.3)
			print(o)
			//print("x:"+data.x+",y:"+data.y+",ySpeed:"+data.ySpeed)
		}catch(e){
			newMouseX=width/2
			newMouseY=height/2
		}
	});
	socket.on('redirect', function(destination) {
		window.location.href = destination;
	});
	
}*/
function setup() {
	//createCanvas(800,800);
	createCanvas(windowHeight, windowHeight);
	//width=windowHeight
	//height=windowHeight
	background(100);
	pixelDensity(2)
	setupSocket("d")
	
	drawingContext.shadowColor = color(0,50)
	drawingContext.shadowOffsetX = 0
	drawingContext.shadowOffsetY = 5
	// drawingContext.shadowBlur = 5
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	// noStroke()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(100,noise(i/3,o/3,i*o/50)*random([0,30,60])))
		}
	}
	overAllTexture.updatePixels()
	for(var i=0;i<width+100;i+=180){
		for(var o=50;o<height+100;o+=150){
			let colors = random([colors1,colors2,colors2])
			let shuffledColors  = colors.slice().sort((a,b)=>random()-0.5)
			snales.push({
				p: createVector(i+random(-20,20),o+random(-20,20)),
				shellColor: shuffledColors[0],
				bodyColor: shuffledColors[1],
				graphColor: shuffledColors[2],
				r: random(30,70),
				graphSpan: int(random(12)+1),
				rId: random(500)
			})
		}
	}
}
let speedScale = 0
function drawSnale(snale){
	push()
		translate(snale.p.x,snale.p.y)
		translate(0,sin(snale.rId+frameCount/50)*20)
		let r = snale.r || 100
		
		noStroke()
		let shellColor = snale.shellColor || color(242,82,82)
		let bodyColor =  snale.bodyColor || color(255, 228, 201)
		let graphColor =  snale.graphColor || color(255)
		fill(bodyColor)
		let eyeRootPos = createVector(0,0)
		push()
			fill(bodyColor)
			noStroke()
			translate(0,r*0.8)
			scale(1,0.8)
			let xx,yy
			for(var i=-r;i<r*1.2;i+=3){
				xx=i
				yy=sin(i/8+frameCount/8+snale.rId)*8
				ellipse(xx,yy,r/1.5)
				eyeRootPos.x = xx
				eyeRootPos.y = yy+r*0.8
			}
		
		pop()
		
		scale(1,0.95)
		fill(shellColor)
		ellipse(0,0,r*2)	
	
		let lastX,lastY
		strokeWeight(r/9)
		stroke(graphColor)
		for(var i=0;i<360*3;i+=4){
			let ang = i/360*2*PI
			let rr = map(i,0,360*3,0,r*0.95)
			let rrr = (sin(i/5000)+1)/5*rr
			let xx = rr*cos(ang+snale.graphSpan/50)
			let yy = rr*sin(ang)
			strokeWeight(rrr)
			if (lastX && i%snale.graphSpan==0){
				line(xx,yy,lastX,lastY)
			}
			lastX=xx
			lastY=yy
		}
	
			
		fill(bodyColor)
		noStroke()
		// rect(-r/1.5,r*1.1,r*1.4,-20)
	
		//eyes
		push()
			stroke(bodyColor)
			strokeWeight(r/10)
			translate(eyeRootPos.x,eyeRootPos.y)
			line(0,0,-r/3,-r)
			line(0,0,r/3,-r)
	
			let eyeR = r/2.2
			ellipse(-r/3,-r,eyeR)
			ellipse(r/3,-r,eyeR)
			noStroke()
			if ((frameCount+snale.rId)%50>5){
				if (speedScale<2){
					fill(255)
					arc(-r/3,-r,eyeR,eyeR,0,PI)
					arc(r/3,-r,eyeR,eyeR,0,PI)
					fill(0)
					arc(-r/3,-r,eyeR/2,eyeR/2,0,PI)
					arc(r/3,-r,eyeR/2,eyeR/2,0,PI)
				}else{
					fill(255)
					ellipse(-r/3,-r,eyeR,eyeR)
					ellipse(r/3,-r,eyeR,eyeR)
					fill(0)
					ellipse(-r/3+speedScale,-r,eyeR/2,eyeR/2)
					ellipse(r/3+speedScale,-r,eyeR/2,eyeR/2)
					
				}
			}
		pop()
	
	pop()
}

function draw() {
	newMouseX=getNewMouseX()
	newMouseY=getNewMouseY()
	frameCount+=speedScale
	speedScale=newMouseX/100
	fill(0,0,0)
	noStroke()
	rect(0,0,width,height)
	for(var o=0;o<height;o+=80){
		stroke(255,50)
		strokeWeight(2)
		push()
			translate(0,o)
		beginShape()
		for(var i=0;i<width;i+=5){
			let x1 = i-5
			let x2 = i
			let y1 = noise(o/10+x1/50+frameCount/20)*50
			let y2 = noise(o/10+x2/50+frameCount/20)*50
			vertex(x1,y1)
		}
		endShape()
		pop()
	}
	
	
	snales.forEach(snale=>{
		drawSnale(snale)
	})
		push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()

	// ellipse(mouseX, mouseY, 20, 20);
}



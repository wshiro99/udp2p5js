let overAllTexture
function setup() {
	createCanvas(1080,1080);
	background(100);
	pixelDensity(4)
	fill(0)
	rect(0,0,width,height)
	
	drawingContext.shadowColor = color(30,50,130,50);
	drawingContext.shadowBlur = 10;
	strokeWeight(1.2)
	stroke(80,40,40)
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	// noStroke()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(100,noise(i/3,o/3,i*o/50)*random([0,50,100])))
		}
	}
	overAllTexture.updatePixels()
	translate(width/2,height/2)
	rotate(-PI/2)
	translate(-width/2,-height/2)
	for(var i=width;i>0;i-=60){
		for(var o=height+120;o>=0;o-=60){
			addMountain(i,o)
		}
	}
		push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
}

function draw() {
	// push()
	// 	translate(random(width),random(height))
	// 	if (frameCount%50==0){
	// 		addMountain()
	// 	}
	// pop()
}

function addMountain(x,y){
	push()
		translate(x,y)
		// blendMode(MULTIPLY)
		var count = int(random(15,30))
		var r = random(30,300)
		let pan = random(2,7)
		// let agDelta = random(-1,1)/2
		push()
		for( var i=0;i<count;i++){
			fill(random(map(i,0,count,0,255),255),
					 random(200-i*4,255),
					 random(50+i*5,255-i*5))
			colorMode(HSB)
			// fill(random(i*3%360,i*5%360),90,90)
			colorMode(RGB)
			if (i%5==0){
				fill(255)
			}

	// 		if (i==count-1){
	// 			fill(100)
	// 		}
			if (i<count-3 || i==count-1){
				ellipse(i*pan,0,r)
			}

			r*=0.9
			if (i==count-1){
				// ellipse(-r/2,0,r/5,r/5)
				fill(255)
				translate(i*pan,0)
				rotate(random(-2,2))
					push()
						rotate(PI/4)
						line(-r/3,0,r/3,0)
						line(0,-r/3,0,r/3)
					pop()
					rotate(PI/4)
					push()
						strokeWeight(2)
						rotate(PI/4)
						line(-r/6,0,r/6,0)
						line(0,-r/6,0,r/6)
					pop()
				for(var o=0;o<20;o++){
					rect(r*1.1,0,r/3,5)
					rotate(PI/5)
				}
				
			}
			// rotate(agDelta)

		}

		pop()
	pop()

}

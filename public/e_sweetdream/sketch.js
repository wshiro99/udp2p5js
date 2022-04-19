var colors1 = "fbaf00-ffd639-ffa3af-007cbe-00af54-fff-f24".split("-").map(a=>"#"+a)
let colors2 = "000-083d77-ebebd3-f4d35e-ee964b-f95738".split("-").map(a=>"#"+a)
let mainCanvas
class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: createVector(0,0),
			size: createVector(0,0),
			a: createVector(0,0),
			color: color(255),
			curve: random(10,30),
			angV: random(-0.015,0.015),
			ang: 0,
			shrinkRatio: random(0.99,0.995)
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	draw(){
		mainCanvas.push()
			mainCanvas.translate(this.p.x,this.p.y)
			mainCanvas.translate(this.size.x/2,this.size.y/2)
			mainCanvas.rotate(this.ang)
			mainCanvas.translate(-this.size.x/2,-this.size.y/2)
			mainCanvas.fill(this.color)
			mainCanvas.rect(0,0,this.size.x,this.size.y)
		mainCanvas.pop()
	}
	update(){
		this.p.add(this.v)
		this.p.x+=random()
		this.p.y+=random()
		let ang = atan2(this.p.x-width/2,this.p.y-height/2)
		
		this.p.x+=sin(this.p.y/(this.curve+this.size.x*5)+ang*50 )/2
		
		this.p.y+=cos(this.p.x/(this.curve+this.size.y*5)+ang*50)/2
		this.v.add(this.a)
		this.v.mult(0.99)
		this.size.mult(this.shrinkRatio)
		this.ang+=this.angV+random()/50 + sin(ang*10)/100
	}
}
let particles =[]
function divide(x,y,w,h,z,colors=colors1){
	mainCanvas.noStroke()
	if (random()<0.5){
		colors = random([colors1,colors2])
	}
	if ( (random()<(0.3+z/5) && w > 15 && h > 15 && z>0) || z>8  ){
		push()
		mainCanvas.translate(width/2,height/2)
		mainCanvas.rotate(-sin(z/10)/10)
		mainCanvas.translate(-width/2,-height/2)
		let ratio = random()
		if (random()<0.5){
			divide(x,y,w*ratio,h,z-1,colors)
			divide(x+w*ratio,y,w*(1-ratio),h,z-1,colors)
		}else{
			divide(x,y,w,h*ratio,z-1,colors)
			divide(x,y+h*ratio,w,h*(1-ratio),z-1,colors)
		}
		pop()
	}else{
		let clr = random(colors)
		particles.push(new Particle({
			p: createVector(x,y),
			v: createVector(sin(x/100)/3,cos(y/100)/3),
			// a: createVector(sin(x/200)/500,cos(y/200)/500),
			size: createVector(w,h),
			color: clr
		}))
// 		mainCanvas.fill(clr)
		
// 		mainCanvas.ellipse(x,y,w,h)
	}
}
let overAllTexture
function setup() {
	pixelDensity(3)
	createCanvas(1920,1080);
	mainCanvas = createGraphics(width,height)
	mainCanvas.background("#efeded");
	background(222)
	divide(0,0,width,height,12)
	mainCanvas.noStroke()
// 	mainCanvas.drawingContext.shadowBlur= 2
// 	mainCanvas.drawingContext.shadowColor= color(0,10)
	
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(200,noise(i/10,i*o/300)*random([0,50	,100])))
		}
	}
	overAllTexture.updatePixels()
}

function draw() {
	particles.forEach(p=>{
		p.update()
		p.draw()
	})
	image(mainCanvas,0,0)
	
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
	// ellipse(mouseX, mouseY, 20, 20);
}


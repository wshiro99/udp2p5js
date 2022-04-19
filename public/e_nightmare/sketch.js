var colors1 = "11151c-212d40-364156-7d4e57-d66853".split("-").map(a=>"#"+a)
let colors2 = "88a2aa-ada296-e2856e-f42c04-0f1a20-1a181b-564d65-3e8989-2cda9d-05f140-fff-ff622d".split("-").map(a=>"#"+a)
let mainCanvas
class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: createVector(0,0),
			size: createVector(0,0),
			a: createVector(0,0),
			color: color(255),
			angV: random(-0.02,0.02),
			ang: 0
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
		this.p.x+=sin(this.p.y/(10+this.size.x*2) )
		
		this.p.y+=cos(this.p.x/(20+this.size.y*2))
		this.v.add(this.a)
		this.v.mult(0.99)
		this.size.mult(0.99)
		this.ang+=this.angV+random()/100
	}
}
let particles =[]
function divide(x,y,w,h,z,colors=colors1){
	if (random()<0.5){
		colors = random([colors1,colors2])
	}
	if (random()<0.2+z/5 && w > 5 && h > 5 && z>0){
		push()
		mainCanvas.translate(width/2,height/2)
		mainCanvas.rotate(-sin(z/10)/100)
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
			v: createVector(x/500,y/500),
			size: createVector(w,h),
			color: clr
		}))
		mainCanvas.fill(clr)
		mainCanvas.rect(x,y,w,h)
	}
}
let overAllTexture
function setup() {
	pixelDensity(2)
	createCanvas(1000,1000);
	mainCanvas = createGraphics(width,height)
	mainCanvas.background(0);
	background(222)
	divide(0,0,width,height,12)
	mainCanvas.noStroke()
	// mainCanvas.drawingContext.shadowBlur= 2
	mainCanvas.drawingContext.shadowColor= color(0,10)
	
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(150,noise(i/10,i*o/300)*random([0,100,200])))
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


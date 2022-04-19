var width, height

let colors = "fff275-ff8c42-ff3c38-a23e48-6c8ead-fff".split("-").map(a=>"#"+a)
var particles = []
let overallTexture
function setup() {
	createCanvas(windowHeight, windowHeight);
	width=windowHeight
	height=windowHeight
	//createCanvas(1000,1000);

	pixelDensity(2)
	background(100);
	fill(0,20,0)
	rect(0,0,width,height)
	// particles.push(new Particle({
	// 	p: createVector(width/2,height/2),
	// 	static: true,
	// 	r: 50,
	// 	color: random(colors),
	// 	density: 10
	// }))
	drawingContext.shadowColor = color(0,50)
	drawingContext.shadowBlur = 8
	for(var i=0;i<450;i++){
		let r =pow(i,0.6)*10+220
		let ang = i/50-PI/8
		particles.push(new Particle({
			p: createVector(r*cos(ang)+width/2,r*sin(ang)+height/2),
			r: sin(i/5)*2+5+1+random(-2,2) ,
			v: createVector(cos(ang),sin(ang)).mult(-5),
			m: random(5,10),
			density: 0.1,
			color: random(colors)
		}))
	}
	
	// overAllTexture=createGraphics(width,height)
	// overAllTexture.loadPixels()
	// // noStroke()
	// for(var i=0;i<width+50;i++){
	// 	for(var o=0;o<height+50;o++){
	// 		overAllTexture.set(i,o,color(150,noise(i/10,i*o/300)*random([0,50,100])))
	// 	}
	// }
	// overAllTexture.updatePixels()
}

function draw() {
	if (frameCount<30){
		fill(0,0.5)
		rect(0,0,width,height)
		
	}
	// for(var i=0;i<particles.length;i++){
	// 	let p = particles[i]
	// 	for(var o=i;o<particles.length;o++){
	// 		if (i!=o){
	// 			let p2 = particles[o]	
	// 			p2.applyForce(p)
	// 		}
	// 	}
	// }
	particles.forEach(p=>{
		p.update()
	})
	particles.forEach(p=>{
		p.draw()
	})
	particles = particles.filter(p=>p.r>1)
	
	// push()
	// 	blendMode(MULTIPLY)
	// 	image(overAllTexture,0,0)
	// pop()
}

class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			lastP: createVector(0,0),
			v: createVector(0,0),
			a: createVector(0,0),
			r: 10,
			m: 10,
			
			density: 1,
			static: false,
			color: "#f24"
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	update(){
		// if (frameCount%5==0){
		this.r*=0.99
		// }
		this.lastP = this.p.copy()
		this.m = sqrt(this.r)*this.density
		if (this.static!==true){
			this.p.add(this.v)
		}
		this.v.add(this.a)
		this.v.x+=(sin(this.p.x/50+frameCount/10))/5
		this.p.y+=(cos(this.p.y/30+frameCount/10))*2
		// this.p.x+=sin(this.p.x/10)*2
		// this.p.y+=cos(this.p.y/20)*2
		// this.p.x+=(noise(this.p.x/100,5)-0.5)*2
		// this.p.y+=(noise(this.p.y/100,1000)-0.5)*2
		
		// let ang = this.p.copy().sub(createVector(width/2,height/2)).heading()
		// if ( int((ang/2/PI)*80)%8==0){
		// 	this.v.add(p5.Vector.random2D())
		// }
		
		this.v.mult(0.99)
	}
	draw(){
		push()
			noStroke()
			rectMode(CENTER)
			translate(this.p)
			let c = color(this.color)
			// noFill()
			c.setAlpha(150)
			blendMode(SCREEN)
			// c.setAlpha(10)
			fill(c)
			// ellipse(0,0,this.r/2)
			// c.setAlpha(1)
			// fill(c)
			// ellipse(0,0,this.r*3,this.r*3)
			// if (true){
				// strokeWeight(random(5)*random())
				// stroke(this.color)
				// if (random()<0.05){
					// fill(this.color)
				// }
				// c.setAlpha(255/frameCount)
				let sc = 1
				
				ellipse(0,0,this.r*sc,this.r*sc)
				// c.setAlpha(50)
				// stroke(c)
				// noFill()
				// strokeWeight(1)
				// ellipse(0,0,this.r*sc*5,this.r*sc*5)
			// }
	
// 			blendMode(SCREEN)
// 			for(var i=0;i<2;i++){
// 				c.setAlpha(1/i*0.6)
				
// 				fill(c)
// 				ellipse(0,0,this.r*2*i/5+this.r)
				
// 			}
// 			blendMode(ADD)
		pop()
	}
	applyForce(other){
		let delta = this.p.copy().sub(other.p)
		let normalDelta = delta.copy().normalize()
		
		//gmm/r^2
		let distance = this.p.dist(other.p)+1
		let amp = 9.8*this.m*other.m/distance/distance
		let amp1 = amp/this.m
		let amp2 = amp/other.m
		this.v.sub(normalDelta.copy().mult(amp1))
		other.v.add(normalDelta.copy().mult(amp2))
		if (distance<this.r+other.r){
			other.p = this.p.copy().sub(normalDelta.mult(this.r+other.r))
			other.v.mult(0.99)
			this.v.mult(0.99)
		}
	}	
	
}



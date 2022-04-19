let colors= "e5e059-bdd358-ffffff-999799-e5625e".split("-").map(a=>"#"+a)
let overAllTexture
let maxParticleR = 30
let canvasTexture
let particleCount = 100
let colorsets = [
	//Paper
	"222-666-999-aaa-ccc-eee-fff-080808".split("-").map(a=>"#"+a),
	//Kimono
	"fff-f24-fae8eb-f6caca-e4c2c6-cd9fcc-0a014f".split("-").map(a=>"#"+a),
	
	// "264653-2a9d8f-e9c46a-f4a261-e76f51".split("-").map(a=>"#"+a),
	// "b1740f-ffd07b-fdb833-296eb4-1789fc-f24-fff-000".split("-").map(a=>"#"+a),
	//Sea
	"e63946-f1faee-a8dadc-457b9d-1d3557".split("-").map(a=>"#"+a),
	// "fff-e71d36-af4319-772014-3f220f-19180a".split("-").map(a=>"#"+a),
	
	// Confetti
	"201e1f-ff4000-faaa8d-feefdd-50b2c0".split("-").map(a=>"#"+a),
	// Vine
	"fff-222-545454-69747c-6baa75-84dd63-cbff4d".split("-").map(a=>"#"+a),
	// Festival
	"12355b-420039-d72638-ffffff-ff570a".split("-").map(a=>"#"+a),
	//Lolipop
	"ff499e-d264b6-a480cf-779be7-49b6ff-fff-000".split("-").map(a=>"#"+a),
	// Eastern
	"333745-e63462-fe5f55-c7efcf-eef5db".split("-").map(a=>"#"+a),
	//Beans
	"fb6107-f3de2c-7cb518-5c8001-fbb02d-fff-111".split("-").map(a=>"#"+a),
	//MonoChrome
	"000-fff-333".split("-").map(a=>"#"+a),
	//Mint
	"000-fff-333-00ffbb".split("-").map(a=>"#"+a),
	//Taxi
	"000-fff-333-fff719".split("-").map(a=>"#"+a),
]
let useColorSet
let mainGraphics
let areas = []

let polySynth

function preload(){
	canvasTexture = loadImage("canvas.jpeg")
}

function playSynth(note='A3',dur,vel=0.2) {
  userStartAudio();
  // notes can overlap with each other
  polySynth.play(note, vel, 0, dur); 
}


function div(x,y,w,h,z){
	if (random()<0.5+z/8 && z>0){
		let ratio = random(0.2,0.8)
		if (random()<0.3){
			let ww = w * ratio
			div(x,y,ww,h,z-1)
			div(x+ww,y,w-ww,h,z-1)
		}else{
			let hh = h * ratio
			div(x,y,w,hh,z-1)
			div(x,y+hh,w,h-hh,z-1)
		} 
	}else{
		let newArea = {
			x,y,
			w,h,
			sx: random(0,2),
			sy: random(0,2),
			noiseX: random(0,100),
			noiseY: random(0,1000),
			noiseXAmp: random(-5,5),
			noiseYAmp: random(-5,5),
			gravity: createVector(random(-0.1,0.1),random(-0.1,0.1)),
			colors: useColorSet,
			id: int(random(100000))
		}
		mainGraphics.noStroke()
		areas.push(newArea)
		mainGraphics.fill(random(newArea.colors))
		mainGraphics.rect(x,y,w,h)
		
		
	}
}
let particles = []
let ang
function setup() {
	useColorSet = random(colorsets)
	maxParticleR = random(25,80)
	
  polySynth = new p5.PolySynth();
	polySynth.setADSR(0.01,0.2,0.2,1)
	
	pixelDensity(2)
	createCanvas(1200,1200);
	mainGraphics = createGraphics(width,height)
	background(100);
	
	ang = random(-0.5,0.5)
	
	
	mainGraphics.fill(0)
	mainGraphics.rect(0,0,width,height)
	
	// translate(width/2,height/2)
	// rotate(random())
	// translate(-width/2,-height/2)
		
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(200,noise(i/10,i*o/300)*random([0,0,20	,100])))
		}
	}
	overAllTexture.updatePixels()
	
	translate(width/2,height/2)
	rotate(ang)
	translate(-width/2,-height/2)
	
	div(0,0,width,height,int(random(2,5)))
	for( var i=0;i<particleCount;i++){
		particles.push(new Particle({
			p: createVector(width/2,height/2),
			v: p5.Vector.random2D().mult(5),
			color: random(colors)
		}))
	}
		
	
	mainGraphics.translate(width/2,height/2)
	mainGraphics.rotate(ang)
	mainGraphics.translate(-width/2,-height/2)
}

let checkParticleInArea = (area,p)=>{
	return p.p.x> area.x && p.p.x < area.x+area.w &&
				 p.p.y > area.y && p.p.y < area.y + area.h
}

function draw() {
	mainGraphics.noStroke()
	
// 	if (mouseIsPressed){
// 		particles.push(new Particle({
// 			p: createVector(mouseX,mouseY),
// 			v: p5.Vector.random2D().mult(5),
// 			color: random(colors)
// 		}))
// 	}
	
	particles.forEach(particle=>{
		particle.update()
		areas.forEach(area=>{
			if (checkParticleInArea(area,particle)){
				if (particle.area!== area){
					particle.area = area
					particle.color = random(area.colors)
					particle.v.rotate(random(-1,1))
					if (random()<0.1){
						let p = new Particle({
							p: particle.p.copy(),
							v: particle.v.copy(),
							a: particle.a.copy()
						})
						particles.push(p)
					}
				}
			}
		})
		particle.draw()
	})
	
	
	image(mainGraphics,0,0)
	
	push()
		blendMode(MULTIPLY)
		image(canvasTexture,0,0,1920*1.15,1080*1.15)
	pop()


	// ellipse(mouseX, mouseY, 20, 20);
}

class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: createVector(0,0),
			a: createVector(0,0),
			r: random(maxParticleR)*random(0.1,1)+1,
			id: int(random(1000)),
			vFriction: random(0.99,1),
			rFactor: random(0.99,0.9995),
			area: null,
			hasFruit: random()<0.5,
			color: 'white',
			life: random(2000)
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}	
	draw(){
		mainGraphics.push()
			mainGraphics.translate(this.p)
			mainGraphics.fill(this.color)
			mainGraphics.ellipse(0,0,this.r,this.r	)
	
			if (random()<0.02){
				let ss = random(5)
				mainGraphics.noFill()
				mainGraphics.strokeWeight(2)
				mainGraphics.stroke(this.color)
				mainGraphics.ellipse(0,0,this.r*ss,this.r*ss	)
				
				// if (random()<0.01){
				// 	playSynth("A"+int(random(1,7)),1)
				// }
			}
		mainGraphics.pop()
	}
	update(){

		if (random()<0.01 && this.area){
			this.color = random(this.area.colors)
		}
		if (this.area){
			// this.p.x+=cos(this.p.x*this.area.sx)/5
			// this.p.y+=sin(this.p.y*this.area.sy)/5
			this.v.x+=cos(this.p.x*this.area.sx/10)/10
			this.v.y+=sin(this.p.y*this.area.sy/10)/10
			
			// this.p.x +=noise(this.p.x*this.area.noiseX)*this.area.noiseXAmp
			// this.p.y +=noise(this.p.y*this.area.noiseY)*this.area.noiseYAmp
			// this.v.x+=this.area.gravity.x
			// this.v.y+=this.area.gravity.y
			// this.
		}
		this.v.mult(this.vFriction)

		this.r*=this.rFactor
		this.p.add(this.v)
		
		this.v.add(this.a)
	}

}
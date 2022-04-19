var width, height

let particles = []
let colors = "FDCA40-f7b2b7-f7717d-de639a-7f2982-16001e-fcfcfc-f7567c-fffae3-88e1d9-5d576b".split("-").map(a=>"#"+a)
// let colors = "fff-fff-2176ff-33a1fd-fdca40-f79824-f72585-7209b7-3a0ca3-4361ee-4cc9f0".split("-").map(a=>"#"+a)
let mainGraphics
let canvasTexture 
function setup() {
	colors=colors.concat(colors).concat(['#2176FF'])
	createCanvas(windowHeight*1920/1080, windowHeight);
	width=windowHeight*1920/1080
	height=windowHeight
	//createCanvas(1920,1080);
	
	mainGraphics = createGraphics(width,height)
	canvasTexture = loadImage("canvas.jpg")
	background(100);
	pixelDensity(1)
	fill(0)
	rect(0,0,width,height)
	mainGraphics.noStroke()
	let gridSpan = random(50,66)
	for(var x=0;x<=width;x+=gridSpan){
		for(var y=0;y<=height;y+=gridSpan){
			particles.push(new Particle({
				p: createVector(x,y),
				color: random(colors),
				r: random([1,5,5,10,10,20,40,40,80]),
				targetColor: random(colors)
			}))
		}
	}
}

function draw() {
	particles.forEach(p=>{
		p.update()
		p.draw(mainGraphics)
	})
	particles = particles.filter(p=>p.r>0.001)
	image(mainGraphics,0,0)
	push()
		blendMode(MULTIPLY)
		image(canvasTexture,0,0)
	pop()
	// ellipse(mouseX, mouseY, 20, 20);
}

class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: createVector(random([-1,0,1]),random([-1,1])),
			a: createVector(0,0),
			r: 30,
			sinDiv: random(30,80),
			randomId: int(random(50000)),
			color: color('white'),
			targetColor: color('white')
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	draw(mainGraphics){
		mainGraphics.push()
			mainGraphics.translate(this.p)
			mainGraphics.fill(this.color)
			mainGraphics.ellipse(0,0,this.r,this.r)
			if (random()<0.99){
				mainGraphics.circle(random(-0.92,0.92)*this.r,random(-0.92,0.92)*this.r,this.r/8)
			}
		mainGraphics.pop()
	}
	update(){
		this.p.add(this.v)
		this.v.add(this.a)
		this.v.mult(0.9995)
		this.v.x+=sin(this.p.x/(100+this.randomId%5))/this.sinDiv
		this.r*=0.99
		if ((frameCount+this.randomId) % 500==0){
			this.targetColor = random(colors)
		}
		this.color = lerpColor(color(this.color),color(this.targetColor),0.02)
	
	}
}
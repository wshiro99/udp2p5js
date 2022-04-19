var width, height

var colors = "083d77-ebebd3-f4d35e-ee964b-f95738-f24".split("-").map(a=>"#"+a)
var colors2 = "22577a-38a3a5-57cc99-80ed99-c7f9cc-fff".split("-").map(a=>"#"+a)
var particles = []
function setup() {
	createCanvas(windowHeight, windowHeight);
	width=windowHeight
	height=windowHeight
	//createCanvas(1000,1000);
	background(100);
	fill("#151023")
	pixelDensity(2)
	rect(0,0,width,height)
	for(var i=0;i<height;i+=4){
		particles.push(new Particle({
			p: createVector(0,(i-height/2)+height/2),
			v: createVector(1,-(i-height/2)/50),
			a: createVector(0.03,0),
			color: colors[int(i/50)%colors.length],
			r: max(1,random(15)*random()*random())
		}))
	}
}

function draw() {
	noStroke()
	// background(0,1)
	particles.forEach(p=>{
		p.update()
		p.draw()
	})
	// ellipse(mouseX, mouseY, 20, 20);
}

class Particle{
	constructor(args){
		let def = {
			lastP: createVector(0,0),
			p: createVector(0,0),
			v: createVector(0,0),
			a: createVector(0,0),
			color: color(255),
			rSpan: random([10,20,50,100]),
			dashSpan: random([1,10,10000000]),
			r: 2
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	update(){
		this.lastP.x = this.p.x
		this.lastP.y = this.p.y
		this.p.add(this.v)
		this.v.add(this.a)
		
			this.p.y+=sin(this.p.x/this.rSpan)*4
			this.p.x+=sin(this.p.y/this.rSpan)*4
		if (int(this.p.x)%20==0){
			this.v.x+=(noise(this.p.x*100,100000)-0.5)/10
			this.v.y+=(noise(this.p.y*100,5)-0.5)/10
			// this.p.y+=sin(this.p.x/5)*2
			// this.p.x+=sin(this.p.y/5)*2
			// this.v.x+=random(-1,1)
			// this.v.y+=random(-1,1)
			if (random()<0.3){
				this.color = random(random([colors,colors2]))
			}
		}
		let delta = createVector(width/2,height/2).sub(this.p)
		this.p.add(delta.mult(0.1).limit(4))
		this.v.mult(0.999)
		this.r*=0.998
	}
	draw(){
		push()
			noStroke()
			strokeWeight(this.r)
			stroke(this.color)
			// translate(this.p.x,this.p.y)
			// ellipse(0,0,this.r)
			if ((frameCount % this.dashSpan)<this.dashSpan*0.7){
				line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
			}
			if (random()<0.1){
				noStroke()
				fill(0,100)
				for(var i=0;i<5;i++){
					ellipse(this.p.x+random(-20,20),this.p.y+random(-20,20),random(2))
				}
			}
			let c = color(this.color)
			c.setAlpha(3)
			stroke(c)
			blendMode(SCREEN)
			// for(var i=4;i<5;i++){
			// 	strokeWeight(i*3)
			// 	line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
			// }
			// strokeWeight(6)
			// line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
			// strokeWeight(8)
			// line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
			
			// ellipse(0,0,this.r*2)
			// ellipse(0,0,this.r*3)
			// ellipse(0,0,this.r*4)
		pop()
		
	}
}
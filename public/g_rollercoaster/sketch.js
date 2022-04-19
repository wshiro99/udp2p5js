let colors = "333-fff-e6e8e6-fbaf00-ffd639-ffa3af-007cbe-00af54-eb5e55-3a3335-d81e5b-fdf0d5-c6d8d3-545863-f96e46-f9c846-ffe3e3".split("-").map(a=>"#"+a)
let useColors = []
let bgColor = "#ede8e8"
let sinFactor
let cosFactor
let noiseFactor
let noiseZoom
let strokeColor
let frameCountFactor = 500
let carW=10,carH=10, carSpan = 20, carDist = 20
let useFrameRate = 20
let span = 10
let canvasTexture 
let polySynth;
let shapeFunc
let oldestNote
let useStrokeCar = false
let chord = "G2,A2,Bb2,C3,D3,Eb3,F3,G3,A3,Bb4,D4,G5,A5,Bb5,C6,D6,Eb6,F6,G6,Bb6".split(",")
let useChord = []
let looping =true
function keyPressed(){
	if (key==' '){
		if (!looping){
			loop()
			looping=true
		}else{
			noLoop()
			looping=false
		}
	}
	
}
function playSynth(note='A3') {
  userStartAudio();

  // note duration (in seconds)
  let dur = 1.5;

  // time from now (in seconds)
  let time = 0;

  // velocity (volume, from 0 to 1)
  let vel = 0.1;

  // notes can overlap with each other
  polySynth.play(note, vel, 0, dur); 
}

function setup() {
	
  polySynth = new p5.PolySynth();
	
	let canvas = createCanvas(1000,1000);
	canvas.mousePressed(playSynth);
	background(0);
	fill(bgColor)
	rect(0,0,width,height)	
	sinFactor = random(1,350)
	cosFactor = random(1,350)
	noiseFactor = random(1,400)
	noiseZoom = random(20,100)
	frameCountFactor = random(300000,500000)
	span = random(2.5,23)
	bgColor = random(colors)
	strokeColor = random(colors)
	while(bgColor==strokeColor && colors.length>=0){
		strokeColor=  random(colors)
	}
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(200,noise(i/10,i*o/300)*random([0,0,0,30,60])))
		}
	}
	overAllTexture.updatePixels()
	useFrameRate = int(random(10,25))
	frameRate(useFrameRate)
	carW = pow(random(0.8,2),2)
	carH = pow(random(0.8,2),2)
	if (random<0.2){
		carW = pow(random(1,2),3)
		carH = pow(random(1,2),3)
	}
	carSpan = random(3,40)
	carDist = carSpan*random()*random()+0.01
	useStrokeCar = random()<0.01
	colors.forEach(clr=>{
		if (random<0.5){
			useColor.push(clr)
		}
	})
	chord.sort((a,b)=>random()<0.5)
	chord.forEach(note=>{
		if (random()<0.8){
			useChord.push(note)
		}
	})
	shapeFunc = random([ellipse,rect])
	pixelDensity(2)
}

function draw() {
	push()
		fill(bgColor)
		rect(0,0,width,height)	
		translate(width/2,height/2)
		noStroke()

		for(var i=0;i<width*8;i+=span){
			translate(span,0)
			stroke(strokeColor)
			rotate(-sin(i/sinFactor)/10
						 -cos(i/cosFactor)/40
						 +noise(i/noiseFactor)/noiseZoom
						 +noise(-i,noiseFactor)/noiseZoom
						 +noise(i/100)/200
						 +sin(frameCount/frameCountFactor)
						)
			strokeWeight(5)
			rect(0,0,span,span)
			strokeWeight(1)
			rect(0,0,span*5,span/2)
			rect(50 + sin(i/(50+sinFactor*5)*200),0,span*5+ sin(i/(50+sinFactor*5+cosFactor*5))*100,span/4)
			
			let isOnNode =  int(i/span)%50==0
			let isCar =  int(i/span+frameCount)%carSpan<=carDist
			if (isOnNode){
				push()
				if ( isCar){
					fill(strokeColor)	
				}
				rectMode(CENTER)
				rect(0,0,span*3,span*3)
				pop()
			}
			//cars
			if (isCar){
				noStroke()
				let colorIndex = int(i/span+frameCount)%colors.length
				if (isOnNode && frameCount!=0 ){
					playSynth(useChord[colorIndex % useChord.length])
				}
				push()
					// ellipse(0,30,span,span)
					fill(colors[colorIndex])
					if (useStrokeCar){
						noFill()
						stroke(colors[colorIndex])
					}
					shapeFunc(20,20,span*carW,span*carH* (isOnNode?2:1))
					// rect(0,0,span*50,span*50)
				pop()
			
			}

		}
	pop()
	
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
}
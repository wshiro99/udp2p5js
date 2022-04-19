let notes =[]
let overAllTexture
function setup() {
	createCanvas(800,800);
	
	overAllTexture=createGraphics(width,height)
	
	overAllTexture.loadPixels()
	for(var i=0;i<width;i++){
		for(var o=0;o<height;o++){
			overAllTexture.set(i,o,color(100,noise(i/3,o/3,i*o/50)*random(0,70)))
		}
	}
	overAllTexture.updatePixels()
	
	background(0);
	fill(255)
	rect(0,0,width,height)
	notes = Array.from({length: 10},(d,tr)=>{
		return Array.from({length: 5},(d,o)=>{
			return Array.from({length: width},(d,i)=>{
				if (i>40 && i%10==0 && i%200!=0 && random()<0.15){
					return {
						// exist: random()<0.2,
						pan: random([-5,0,-15,10]),
						fill: random()<0.9,
						sign: random(["♭","♯","","","","","","",""])
					}
				}
			})
	 })
	})
}

function draw() {
	fill(255)
	rect(0,0,width,height)
	push()
	translate(0,-10)
	// background(255)
	for(var track=0;track<9;track++){
		let trackY = track*85
		push()
			textSize(75)
			fill(0)
			text("𝄞",30,trackY+90)
			strokeWeight(5)
			strokeCap(PROJECT);
			line (20,trackY+50,20,trackY+50+40)
		
			strokeWeight(1)
			strokeCap(PROJECT);
			line (30,trackY+50,30,trackY+50+40)
		pop()
		for(var o=0;o<5;o++){
			let hh = 50+trackY
			let lastlineY, lastlineX
			
			let lastNoteX,lastNoteY
			let nowNoteX,nowNoteY
			for(var i=20;i<width;i+=5){
				let crazy = map(i,mouseX || width/2,width,0,120,true) 
				let lineY = hh+o*10+ crazy*(noise(i/40,frameCount/50,o*5+track)-0.5)
				let dd = createVector(i,lineY).sub(createVector(mouseX,mouseY))
				if (dd.mag()<500){
					dd = dd.limit(1/dd.mag()*500)
				}else{
					dd.set(0,0)
				}
				let xx = i+2 + dd.x
				let yy = lineY+ dd.y
				line(lastlineX || i,lastlineY || lineY,xx,yy)
					if (i%200==0 && o==0){
						line(i,lineY,i,lineY+40)	
					}
				let note  = notes[track][o][i]
				if (note){
					
					push()
						translate(0,note.pan)
					
						scale(1+ map(crazy,0,200,0,noise(frameCount/50,i,o)/2,true))
					
						fill(0)
						let endY =  max(lineY-30,hh-30)
						line(i+5,lineY,i+5,endY )
						translate(i,lineY)
						shearY(-0.2)
						textSize(14)
						text(note.sign,5,-3)
						if (!note.fill){
							noFill()
							strokeWeight(2)
							stroke(0)
						}else{
							fill(0)
						}
						push()
							blendMode(MULTIPLY)
							noStroke()
							stroke(255,0,0)
							fill(255,0,0)
							if (!note.fill){
								noFill()
								strokeWeight(2)
								stroke(255,0,0)
							}else{
							noStroke()
								
							}
							ellipse(crazy/50,-crazy/40,10,7)
					
							stroke(0,255,0)
							fill(0,255,0)
							if (!note.fill){
								noFill()
								strokeWeight(2)
								stroke(0,255,0)
							}else{
							noStroke()
								
							}
							ellipse(crazy/30,crazy/45,10,7)
					
					
// 							stroke(0,0,255)
// 							fill(0,0,255)
// 							if (!note.fill){
// 								noFill()
// 								strokeWeight(2)
// 								stroke(0,0,255)
// 							}else{
// 							noStroke()
								
// 							}
// 							ellipse(crazy/20,crazy/30,10,7)
							
						pop()
						ellipse(0,0,10,7)
						lastNoteX=nowNoteX
						lastNoteY=nowNoteY
						nowNoteX=i+5
						nowNoteY=endY
					pop()
					// if (random()<0.1){
					if (lastNoteX && lastNoteX!=nowNoteX && nowNoteX-lastNoteX<40){
						push()
						strokeWeight(4)
						line(lastNoteX,lastNoteY,nowNoteX,nowNoteY)
						pop()
					}
					// }
					

				}
				lastlineX=xx
				lastlineY=yy
				

			}
		}
	}
	pop()
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
	// ellipse(mouseX, mouseY, 20, 20);
}
//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144
let colors = "132a13-31572c-4f772d-90a955-ecf39e-f4b860-c83e4d".split("-").map(a => "#" + a)
let chord = "C2,Eb2,G2,C3,Eb3,G3,C4,Eb4,G4,C5,Eb5,G5".split(",")
// let chordSet = "A,E,A,E,G#".split(";").map(a=>a.split(","))
let polySynth
let theShader;

let webglgraphics, graphics, graphics2;
function playSynth(note='A3',dur) {
  userStartAudio();
  let vel = random(0.2);
  polySynth.play(note, vel, 0, dur); 
}
function preload() {
	theShader = new p5.Shader(this.renderer, vert, frag)
}

function setup() {
	createCanvas(1000, 1000);
	pixelDensity(2)
	webglgraphics = createGraphics(1000, 1000, WEBGL);
	graphics = createGraphics(width, height)
	graphics2 = createGraphics(width, height)
  polySynth = new p5.PolySynth();
	polySynth.setADSR(1,1,1,1)
	noStroke()
	background(0);
 	useChord = chord 
	chord = [2,3,4,5].map(n=>useChord.map(note=>note+n)).flat().filter(a=>a)
}

let autoMovemouse = true

function mouseMoved() {
	autoMovemouse = false
}
let notePlayCount = 0 

function draw() {
	if (autoMovemouse) {
		mouseX = sin(frameCount / 30) * width
		mouseY = cos(frameCount / 40 + PI / 4) * height
	}
	if (frameCount%100==1){
			let targetNode1 = chord[int(random(0,chord.length/2))]
			let targetNode2 = chord[int(random(chord.length/2,chord.length))]
			playSynth(targetNode1,random(5))
			playSynth(targetNode2,random(5))
			notePlayCount+=2
		}
	webglgraphics.shader(theShader)
	theShader.setUniform('u_resolution', [width / 1000, height / 1000])
	theShader.setUniform('u_time', millis() / 1000)
	theShader.setUniform('u_mouse', [mouseX / width, mouseY / height])
	theShader.setUniform('u_original_tex', graphics);
	webglgraphics.rect(0, 0, width, height)

	graphics.background(0, 100)
	graphics.noStroke()
	graphics.push()

	image(webglgraphics, 0, 0)
	image(graphics2, 0, 0)


	stroke(255)
}

function keyPressed() {
	if (key == ' ') {
		save()
	}
}


const frag = `
	#ifdef GL_ES
	precision mediump float;
	#endif

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	uniform sampler2D u_original_tex;

	varying vec2 vTexCoord;

	float rand(vec2 c){
		return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	//	Classic Perlin 3D Noise 
	//	by Stefan Gustavson
	//
	vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
	vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
	vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

	float cnoise(vec3 P){
		vec3 Pi0 = floor(P); // Integer part for indexing
		vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
		Pi0 = mod(Pi0, 289.0);
		Pi1 = mod(Pi1, 289.0);
		vec3 Pf0 = fract(P); // Fractional part for interpolation
		vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
		vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
		vec4 iy = vec4(Pi0.yy, Pi1.yy);
		vec4 iz0 = Pi0.zzzz;
		vec4 iz1 = Pi1.zzzz;

		vec4 ixy = permute(permute(ix) + iy);
		vec4 ixy0 = permute(ixy + iz0);
		vec4 ixy1 = permute(ixy + iz1);

		vec4 gx0 = ixy0 / 7.0;
		vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
		gx0 = fract(gx0);
		vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
		vec4 sz0 = step(gz0, vec4(0.0));
		gx0 -= sz0 * (step(0.0, gx0) - 0.5);
		gy0 -= sz0 * (step(0.0, gy0) - 0.5);

		vec4 gx1 = ixy1 / 7.0;
		vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
		gx1 = fract(gx1);
		vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
		vec4 sz1 = step(gz1, vec4(0.0));
		gx1 -= sz1 * (step(0.0, gx1) - 0.5);
		gy1 -= sz1 * (step(0.0, gy1) - 0.5);

		vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
		vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
		vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
		vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
		vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
		vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
		vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
		vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

		vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
		g000 *= norm0.x;
		g010 *= norm0.y;
		g100 *= norm0.z;
		g110 *= norm0.w;
		vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
		g001 *= norm1.x;
		g011 *= norm1.y;
		g101 *= norm1.z;
		g111 *= norm1.w;

		float n000 = dot(g000, Pf0);
		float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
		float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
		float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
		float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
		float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
		float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
		float n111 = dot(g111, Pf1);

		vec3 fade_xyz = fade(Pf0);
		vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
		vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
		float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
		return 2.2 * n_xyz;
	}

	vec2 random2( vec2 p ) {
			return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
	}

	void main(){
		vec2 st = vTexCoord.xy /u_resolution.xy;
		st.y = 1.0 - st.y;
		vec3 color = vec3(0.); 
		st.x+=cnoise(vec3(st*3.,u_time))/80.;
		st.y+=cnoise(vec3(st*3.,u_time))/80.;

		vec2 ct = (u_mouse-0.5)/50.+0.5;
		vec2 dv = st-ct;
		float d = length(dv);
		
		float ang = atan(dv.y/dv.x);
		
		st+=random2(st)/30.;
		st.x+=cnoise(vec3(u_mouse.x+st*30.+ang*10.,u_time))/30.;
		st.y+=cnoise(vec3(u_mouse.y+st*30.+ang*30.,u_time))/30.;
		
		st.x+=cnoise(vec3(st*300.,u_time/5.))/80.;
		st.y+=cnoise(vec3(st*300.,u_time/5.))/80.;
		

		d+=log(d/0.46)/32.+sin(u_time/1000.)/10.;
		
		d+=random2(st)[0]*0.01;
		float mask = d<0.46?1.:0.;
		
		d+=log(d/0.46)/64.+sin(u_time/1000.);
		
		st.x+=cnoise(vec3(st,u_time/2.))/50.;
		st.y+=cnoise(vec3(st,u_time/2.))/50.;
		
		st.x+=cnoise(vec3(st*5.+ang*5.,u_time/10.))/3.;
		st.y+=cnoise(vec3(st*5.,u_time/10.))/3.;
		st.x+= sin(-d*20.+u_time)/5.;
		st.y+= sin(-d*20.+u_time)/5.;
		
		color.r = sin(u_mouse.x+st.x/2.+6.*st.y);
		
		color.g = sin(u_mouse.y+st.x/2.*3.+4.*st.y)/1.5 + cnoise(vec3(st,u_time/5.)) ;
		color.b =  sin(u_mouse.x+u_mouse.y+st.x/2.+3.*st.y);
		
		color*=mask;
		   
		gl_FragColor= vec4(color,1.0);
	}
`



const vert = `
	attribute vec3 aPosition;
	attribute vec2 aTexCoord;

	varying vec2 vTexCoord;

	void main() {
		vTexCoord = aTexCoord;
		
		
		vec4 positionVec4 = vec4(aPosition, 1.0);
		positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

		gl_Position = positionVec4;
	}
`;


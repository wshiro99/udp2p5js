var x=400, y=400
var xArray=[],yArray=[]
var tmp

function getNewMouseArray(){
    var tmpx=xArray
    return tmpx;
}

function getNewMouseX(){
    return x;
}
function getNewMouseY(){
    return y;
}
function getXSpeed(){
    return tmp[2];
}
function getYSpeed(){
    return tmp[3];
}
function getXAcc(){
    return tmp[4];
}
function getYAcc(){
    return tmp[5];
}

function getWallInfo(id){
    if(id=="c"){
        return {xStart:0, xEnd:10, yStart:38, yEnd:28, xMapStart:0, xMapEnd:4782, yMapStart:0, yMapEnd:2160}
    }
    else if(id=="b"){
        return {xStart:27, xEnd:38, yStart:0, yEnd:4, xMapStart:0, xMapEnd:4782, yMapStart:0, yMapEnd:2160}
    }
    else if(id=="d"){
        return {xStart:38, xEnd:27, yStart:10, yEnd:6, xMapStart:0, xMapEnd:4782, yMapStart:0, yMapEnd:2160}
    }
    else if(id=="e"){
        //return {xStart:38, xEnd:0, yStart:10, yEnd:0, xMapStart:0, xMapEnd:12336, yMapStart:0, yMapEnd:3188}
        return {xStart:38, xEnd:0, yStart:10, yEnd:0, xMapStart:0, xMapEnd:3084, yMapStart:0, yMapEnd:797}
    }
}

function setupSocket(wall){
    var o=getWallInfo(wall)
	var socket = io.connect();		
	socket.on('message', function(data) {
		try{
            //clean array
            while (xArray.length) {
                xArray.pop();
            }
            //var test="0:31,10,0,0,0,0;1:20,4,0,0,0,0;2:5,3,0,0,0,0"
            //var hc=test.split(";")
            var hc=data.split(";")
            var idLock=-1
            //var hc=data.toString().split(";") 
            for(var i=0;i<hc.length;i++){
                var spliter=hc[i].split(":")  
                tmp=spliter[1].split(",")  //tmp[0~5]
                var id=spliter[0];
                var mx=tmp[0]
                var my=tmp[1]
                if(wall=="c"){
                    if(my>=min(o.xStart,o.xEnd)&&my<=max(o.xStart,o.xEnd)&&mx>=min(o.yStart,o.yEnd)&&mx<=max(o.yStart,o.yEnd)){
                        if(idLock<0||idLock==id){
                            x=lerp(x, map(my,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.3)
                            y=lerp(y, map(mx,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.3)
                            console.log("id:"+id+","+x+","+y)
                            idLock=id
                        }
                    } 
                    else{
                        if(idLock==id) 
                            idLock=-1
                    }              
                }
                else if(wall=="b"||wall=="d"||wall=="e"){
                    if(mx>=min(o.xStart,o.xEnd)&&mx<=max(o.xStart,o.xEnd)&&my>=min(o.yStart,o.yEnd)&&my<=max(o.yStart,o.yEnd)){ 
                        ////for floor test
                        if(wall=="e"){ 
                            x=map(mx,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd)
                            y=map(my,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd)
                            //x=lerp(x, map(mx,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.03)
                            //y=lerp(y, map(my,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.03)	
                            xArray.push({"x":x,"y":y,"id":id})   
                            //console.log("xxx:"+x+","+y)                         
                        }
                        else{
                            if(idLock<0||idLock==id){
                                x=lerp(x, map(mx,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.3)
                                y=lerp(y, map(my,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.3)	
                                console.log("id:"+id+","+x+","+y)
                                idLock=id
                            }
                        }
                    }
                    else{
                        if(idLock==id) 
                            idLock=-1
                    }
                }
            }
    
            /*var mx=xy[0]
            var my=xy[1]

            if(wall=="c"){
    			x=lerp(x, map(my,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.3)
                y=lerp(y, map(mx,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.3)
            }
            else if(wall=="b"||wall=="d"||wall=="e"){
                x=lerp(x, map(mx,o.xStart,o.xEnd,o.xMapStart,o.xMapEnd) ,0.3)
    			y=lerp(y, map(my,o.yStart,o.yEnd,o.yMapStart,o.yMapEnd) ,0.3)	    		
            }*/
            
			//newMouseY=lerp(newMouseY, map(data.x,38,30,0,2160) ,0.3)
			//newMouseX=lerp(newMouseX, map(data.y,0,10,0,4782) ,0.3)
			console.log(data)
            console.log(o)
			//print("x:"+data.x+",y:"+data.y+",ySpeed:"+data.ySpeed)
		}catch(e){
            console.log(e)
            //no one
			//newMouseX=width/2
			//newMouseY=height/2
		}
	});
	//socket.on('redirect', function(destination) {
	//	var s = document.createElement("script");
	//	s.type = "text/javascript";
	//	s.src = "./b_snails.js";
	//	s.innerHTML = null;
	//	document.body.appendChild(s);
		//window.location.href = destination;
	//});
}
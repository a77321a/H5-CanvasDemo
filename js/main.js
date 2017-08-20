var can1;
var can2;

var ctx1;
var ctx2;

var canWidth;
var canHeight;

var lastTime;
var deltaTime;

var bgPic = new Image();

var ane;
var fruit;

var mom;
var baby;

var mx;
var my;

var data;

var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBodyOra = [];
var momBodyBlue = [];

var wave;
var halo;

var dust;
var dustPic = [];

document.body.onload = game;
function game()
{
	init();
	lastTime = Date.now();
	deltaTime = 0;    //每两帧之间的时间间隔
	gameloop();
}

function init()
{
	//获得canvas context
	can1 = document.getElementById("canvas1"); //fishes,dust,UI,circle
	ctx1 = can1.getContext('2d');
	can2 = document.getElementById("canvas2"); //背景，海葵，果实
	ctx2 = can2.getContext('2d');
	
	can1.addEventListener('mousemove',onMouseMove,false);
	
	bgPic.src = "./img/background.jpg";
	canWidth = can1.width;
	canHeight = can1.height;
	
	ane = new aneObj();
	ane.init();
	
	fruit = new fruitObj();
	fruit.init();
	
	mom = new momObj();
	mom.init();
	
	baby = new babyObj();
	baby.init();
	
	mx = canWidth * 0.5;
	my = canHeight * 0.5;
	
	for(var i=0; i < 8; i++)
	{
		babyTail[i] = new Image();
		babyTail[i].src = "./img/babyTail" + i + ".png";
	}
	
	for(var i= 0;i<2;i++)
	{
		babyEye[i] = new Image();
		babyEye[i].src = "./img/babyEye" + i + ".png";
	}
	
	for(var i = 0; i < 20; i++)
	{
		babyBody[i] = new Image();
		babyBody[i].src = "./img/babyFade" + i + ".png";
	}
	
	for(var i = 0; i < 8; i++)
	{
		momTail[i] = new Image();
		momTail[i].src = "./img/bigTail" + i + ".png";
	}
	
	for(var i = 0; i < 2; i++)
	{
		momEye[i] = new Image();
		momEye[i].src = "./img/bigEye" + i + ".png";
	}
	
	data = new dataObj();
	
	for(var i = 0; i < 8; i++)
	{
		momBodyOra[i] = new Image();
		momBodyBlue[i] = new Image();
		momBodyOra[i].src = "./img/bigSwim" + i + ".png";
		momBodyBlue[i].src = "./img/bigSwimBlue" + i + ".png";
	}
	ctx1.font = "30px Verdane";
	ctx1.textAlign = "center";  //left,center,right
	
	wave = new waveObj();
	wave.init();
	
	halo = new haloObj();
	halo.init();
	
	for(var i = 0; i < 7; i++)
	{
		dustPic[i] = new Image();
		dustPic[i].src = "./img/dust" + i + ".png";
	}
	dust = new dustObj();
	dust.init();
}
//绘制背景
function drawBackground()
{
	ctx2.drawImage(bgPic,0,0,canWidth,canHeight);
}
//绘制海葵
var aneObj = function()
{
	//start point,control point,end point(sin)   贝塞尔曲线
	this.rootx = [];
	this.headx = [];
	this.heady = [];
	this.amp = [];
	this.alpha = 0;
}
aneObj.prototype.num = 50;
aneObj.prototype.init = function()
{
	for(var i = 0; i < this.num; i++)
	{
		this.rootx[i] = i * 16 + Math.random() * 20;  //[0,1) math.random的取值，可以取到0，不能取到1.
		this.headx[i] = this.rootx[i];
		this.heady[i] = canHeight - 250 + Math.random() * 50;
	    this.amp[i] = Math.random() * 50 + 50;
	}
	
}
aneObj.prototype.draw = function()
{
	this.alpha += deltaTime * 0.0008;
	var l = Math.sin(this.alpha);   //[-1,1]
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	ctx2.lineWidth = 20
	ctx2.lineCap = "round";
	ctx2.strokeStyle = "#3b154e";
	for(var i = 0;i < this.num; i++ )
	{
		//beginPath, moveTo, lineTo, stroke,strokeStyle,lineCap,  globalAlpha(全局透明度)
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i],canHeight);
		this.headx[i] = this.rootx[i] + l * this.amp[i];
		ctx2.quadraticCurveTo(this.rootx[i],canHeight - 100,this.headx[i] + l,this.heady[i]);   //贝塞尔曲线
		ctx2.stroke();
		
	}
	ctx2.restore();
}
//海葵结束
//绘制果实
var fruitObj = function()
{
	this.alive = []; //bour值
	this.x=[];
	this.y=[];
	this.aneNO = [];
	this.l=[];
	this.spd = []; //速度
	this.fruitType = [];
	this.orange = new Image();
	this.blue = new Image();
}
fruitObj.prototype.num = 30;
fruitObj.prototype.init = function()
{
	for (var i= 0;i < this.num; i++)
	{
		this.alive[i] = true;
		this.x[i] = 0;
		this.y[i] = 0;
		this.aneNO[i] = 0;
		this.spd[i] = Math.random() * 0.017 + 0.003;          //[0.003,0.02)
		this.fruitType[i] = "";
		this.l[i] = 0;
		this.born(i);
	}
	this.orange.src = "./img/fruit.png";
	this.blue.src = "./img/blue.png";
}
fruitObj.prototype.draw = function()
{
	for(var i = 0;i<this.num;i++)
	{
			//draw
	        //find an ane,grow,fly up
	        if(this.alive[i])
	        {
	        	if(this.fruitType[i] == "blue")
	        	{
	        		var pic = this.blue;
	        	}
	        	else
	        	{
	        		var pic = this.orange;
	        	}
		        	if(this.l[i] <= 14)
		        {
		        	var NO = this.aneNO[i]
		        	this.x[i] = ane.headx[NO];
		        	this.y[i] = ane.heady[NO];
		        	this.l[i] += this.spd[i] * deltaTime;  //成长速度
		            //ctx2.drawImage(pic,this.x[i] - this.l[i] * 0.5,this.y[i] - this.l[i] * 0.5,this.l[i],this.l[i]);
		        }
		        else
		        {
		        	this.y[i] -= this.spd[i] * 7 * deltaTime;
		        }
 		        	ctx2.drawImage(pic,this.x[i] - this.l[i] * 0.5,this.y[i] - this.l[i] * 0.5,this.l[i],this.l[i]);
		        if(this.y[i] < 10)
		        {
		        	this.alive[i] = false;
		        }
	        }
	        
	}
	
}
fruitObj.prototype.born = function(i)
{
    this.aneNO[i] = Math.floor(Math.random() *ane.num);
	this.l[i] = 0;
	this.alive[i] = true; 
	var ran = Math.random();
	if(ran < 0.2)
	{
		this.fruitType[i] = "blue";
	}
	else
	{
		this.fruitType[i] = "orange";          //orange,blue
	} 
}

fruitObj.prototype.dead = function(i)
{
	this.alive[i] = false;
}

function fruitMonitor()
{
	var num = 0;
	for( var i = 0; i < fruit.num; i++)
	{
		if(fruit.alive[i]) num++;
	}
	if(num < 15)
	{
		//send fruit
		sendFruit();
		return;
	}
}
function sendFruit()
{
	for(var i = 0;i < fruit.num; i++)
	{
		if(!fruit.alive[i])
		{
			fruit.born(i);
			return;
		}
	}
}

fruitObj.prototype.update = function()
{
	var num = 0;
	for(var i = 0;i<this.num;i++)
	{
		if(this.alive[i]) num++;
	}
}






function gameloop()
{
	requestAnimFrame(gameloop);//setInterval,setTimeout(), frame per second
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	if(deltaTime > 40) deltaTime = 40;	
	
	drawBackground();
	ane.draw();
	fruitMonitor();
	fruit.draw();
	
	ctx1.clearRect(0,0,canWidth,canHeight);
	mom.draw();
	baby.draw();
	momFruitsCollsion();	
	momBabyCollision();
	
	data.draw();
	wave.draw();
	halo.draw();
	dust.draw();
}

function onMouseMove(e)
{
	if(!data.gameOver)
	{
		if(e.offsetX || e.layerX)
	{
		mx = e.offsetX == undefined ? e.layerX : e.offsetX;
		my = e.offsety == undefined ? e.layerY : e.offsetY;
	}
	}
}



//判断大鱼和果实的距离
function momFruitsCollsion()
{
	if(!data.gameOver)
	{
		for(var i = 0; i < fruit.num; i++)
	{
		if (fruit.alive[i])
		{
//			calculate length
            var l = calLength2(fruit.x[i],fruit.y[i],mom.x,mom.y);
            if(l < 900)
            {
            	//fruit eaten
            	fruit.dead(i);
            	data.fruitNum++;
            	mom.momBodyCount++;
            	if(mom.momBodyCount > 7)
            	     mom.momBodyCount = 7;
            	if(fruit.fruitType[i] == "blue")   //blue果实
            	{
            		data.double = 2;
            	}
            	wave.born(fruit.x[i],fruit.y[i]);
            }
		}
	}
	}
	
}
//mom baby collision
function momBabyCollision()
{
	if(data.fruitNum > 0 && !data.gameOver)
	{
		var l = calLength2(mom.x,mom.y,baby.x,baby.y);
		if(l < 900)
		{
			//baby recover
			baby.babyBodyCount = 0;
			mom.momBodyCount = 0;
			//score update
			data.addScore();
			//draw
			halo.born(baby.x,baby.y);
		}
	}
}




//得分

var dataObj = function()
{
	this.fruitNum = 0;
	this.double = 1;
	this.score = 0;
	this.gameOver = false;
	this.alpha = 0;
}

dataObj.prototype.draw = function()
{
	var w = can1.width;
	var h = can1.height;
	
	ctx1.save();
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = "white";
	ctx1.fillStyle = "white";
//	ctx1.fillText("num " + this.fruitNum, w * 0.5, h - 50);
//	ctx1.fillText("double " + this.double, w * 0.5, h - 80);
	ctx1.fillText("SCORE: " + this.score, w * 0.5, h - 20);
	
	if(this.gameOver)
	{
		this.alpha += deltaTime * 0.0005;
		if(this.alpha > 1)
		this.alpha = 1;
		ctx1.fillStyle = "rgba(255,255,255," + this.alpha +")";
		ctx1.fillText("GAMEOVER", w * 0.5 , h * 0.5);
	}
	ctx1.restore();
}
dataObj.prototype.addScore = function()
{
	this.score += this.fruitNum * 100 * this.double;
	this.fruitNum = 0;
	this.double = 1;
}




//绘制光圈特效
var haloObj = function()
{
	this.x = [];
	this.y = [];
	this.alive = [];
	this.r = [];
}
haloObj.prototype.num = 5;
haloObj.prototype.init = function()
{
	for(var i = 0; i < this.num; i++)
	{
		this.x[i] = 0;
		this.y[i] = 0;
		this.alive[i] = false;
		this.r[i] = 0;
	}
}
haloObj.prototype.draw = function()
{
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = "rgba(203,91,0,1)";
    for(var i = 0; i < this.num; i++)
    {
    	if(this.alive[i])
    	{
    		//draw
//  		console.log("draw");
             this.r[i] += deltaTime * 0.05;
             if(this.r[i] > 100)
             {
             	this.alive[i] = false;
             	break;
             }
             var alpha = 1 - this.r[i] / 100;
             
             ctx1.beginPath();
             ctx1.arc(this.x[i],this.y[i],this.r[i], 0, Math.PI * 2);
             ctx1.closePath();
             ctx1.strokeStyle = "rgba(203,91,0," + alpha + ")";
             ctx1.stroke();
    	}
    }
    ctx1.restore();
}
haloObj.prototype.born = function(x,y)
{
	for(var i = 0; i < this.num; i++)
	{
		if(!this.alive[i])
		{
			this.x[i] = x;
			this.y[i] = y;
			this.r[i] = 10;
			this.alive[i] = true;
		}
	}
}





































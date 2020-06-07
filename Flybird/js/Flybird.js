var bgm=document.querySelector(".bgm");
var canvas=document.querySelector(".canvas");
var start_btn=document.querySelector('.start_btn');
var btns=document.querySelector(".btns");
var bird=document.querySelector("#flybird");
var game_start=document.querySelector('.game_start');
var scoring=document.querySelector(".scoring");
var historyscore=document.querySelector(".historyscore");
var thisscore=document.querySelector(".thisscore");
var ok=document.querySelector(".ok");
var gameover=document.querySelector(".gameover");
var conduit_group=document.querySelector(".conduit_group");
var maxSpeed=8;
var speed=0;
var score=0;
var isGameOver=true;
var upTimer=null;
var downTimer=null;
var crashTestTimer=null;

bgm.pause();


//生成管道随机数
function random_pipe(min,max){
	return parseInt(Math.random()*(max-min)+min);
}
//创建管道
function create_pipe(){
var conduit_group=document.querySelector(".conduit_group");
var conduitItem=document.createElement("div");
conduitItem.className="conduitItem";
conduit_group.appendChild(conduitItem);
var topHeight=random_pipe(100,200);
var bottomHeight=410-topHeight-130;
conduitItem.innerHTML='<div class="top_conduit"><div style="height:'+ topHeight+
'px"></div></div><div class="bottom_conduit"><div style="height:'+ bottomHeight + 
'px"></div></div>';
var maxWidth = canvas.offsetWidth;
conduitItem.style.left = maxWidth +"px";
conduitItem.moveTimer=setInterval(function () {
	maxWidth = maxWidth-80;
	conduitItem.style.left=maxWidth +"px";
	conduitItem.addScore=true;
	if (maxWidth <-80) {
		clearInterval(conduitItem.moveTimer);
		conduit_group.removeChild(conduitItem);
	}
	if (conduitItem.offsetLeft<-20 & conduitItem.addScore==true) {
		score++;
		conduitItem.addScore=false;
		FnScore(score);
	}
},1000);
}

function FnScore(score) {
	var nowScore=score;
	var scoretext=nowScore.toString();
	scoring.innerHTML=null;
    for (var i = 0;i<scoretext.length;i++) {
		var img=document.createElement("img");
	 	img.src='images/'+scoretext[i]+'.jpg';
	 	scoring.appendChild(img);
	 } 
}

function birdJump() {
	speed=maxSpeed;
	if (isGameOver) {
		clearInterval(upTimer);
		clearInterval(downTimer);
		upTimer=setInterval(bird_up,50);
	}
}

function bird_up(){
	speed=speed-1;
	bird.id="flybird_up";
	if (speed<0) {
		speed=0;
		clearInterval(upTimer);
		downTimer=setInterval(bird_down,50);
	}
	bird.style.top=bird.offsetTop-speed+"px";
}

function bird_down() {
	speed=speed+1;
	bird.id="flybird_down";
	if (speed>8) {
		speed=maxSpeed;
	}
	bird.style.top=bird.offsetTop+speed+"px";
	floortest();
}

function floortest(){
	var t=bird.offsetTop;
	if (t<0) {
		gameOver();
	}
	if (t>420) {
		gameOver();
	}
}

function gameOver() {
	bgm.pause();
	isGameOver=false;
	clearTimer();
	bird.id="flybird";
	bird.className="birddown";
	bird.style.top="400px";
	var history=localStorage.getItem('maxscore');
	if (history==null || history<score) {
		localStorage.setItem('maxscore', score);
		history=score;
	}
	historyscore.innerHTML=history;
	thisscore.innerHTML=score;
	document.querySelector(".gameover").style.display = "block";
}

function clearTimer(){
	var setTimer=setInterval(function(){},50);
	for(var i=0;i<setTimer;i++){
		clearInterval(i);
	}
}

function crashTest(obj1,obj2){
	var l1=bird.offsetLeft;
	var r1=l1+bird.offsetWidth;
	var l2=obj2.offsetLeft;
	var r2=l2+obj2.offsetWidth;
	var t1=bird.offsetTop;
	var t2=t1+bird.offsetHeight;
	var b1=obj1.offsetTop;
	var b2=b1+obj1.offsetHeight;
	if (l1<r2  & r1>l2 & t1<b2 & t2>b1) {
		gameOver();
	}
}

function judge() {
	var conduitItem=document.querySelector(".conduit_group").
	querySelectorAll(".conduitItem");
	for (var i = 0;i<conduitItem.length;i++) {
		var top_conduit=conduitItem[i].querySelector(".top_conduit");
		var bottom_conduit=conduitItem[i].querySelector(".bottom_conduit");
		crashTest(top_conduit,conduitItem[i]);
		crashTest(bottom_conduit,conduitItem[i]);
	}
}

function init() {
	start_btn.onclick=function(){
         game_start.style.display = 'none';
         bird.style.display = 'block';
         bgm.play();
         bird.style.top="200px";

         createTimer=setInterval(create_pipe, 2000);
         addEventListener("click", birdJump, false);
         crashTestTimer=setInterval(judge,50);
	}
}

function restart() {
	ok.onclick=function () {
		clearTimer();
		gameover.style.display ="none";
		game_start.style.display = "block";
		speed=0;
		score=0;
		maxSpeed=8;
		isGameOver=true;
		bird.className = 'bird';
		bird.style.display ="none";
        conduit_group.innerHTML=" ";
		scoring.style.display='none';
	}
}

init();
restart();
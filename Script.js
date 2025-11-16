//Selecting The Canvas
let can = document.getElementById("table");
let draw = can.getContext('2d');

//Drawing Shape

//Rectangle
draw.fillStyle = "red"; 
draw.fillRect(100,100,30,30);

draw.fillStyle = "orange";
draw.beginPath();

//0 => start angles and false => clockwise direction
draw.arc(200,200,10,0,Math.PI*2,false);
draw.closePath();
draw.fill();

/*Creating Object                                                                      
 1. user                                                                                               
 2. computer                                                                                     
 3. Ball                                                                                                  
 4. Separator                                                                                           
 5. Score Card */

// User Object
const user = { 
    x: 0, 
    y: (can.height - 100)/2, 
    width:10, 
    height: 100, 
    score: 0, 
    color: "white"
}
 
// CPU Object
const cpu = { 
    x: can.width - 10, 
    y: (can.height - 100)/2, 
    width: 10, 
    height: 100, 
    score: 0, color: "red"
}

// Ball Object
const ball = {                                                                                      
    x: can.width/2, 
    y: can.height/2, 
    radius: 10, 
    vel_in_x_dir: 5, 
    vel_in_y_dir: 5, 
    speed : 7, 
    color : "green"
}

// Separator Object
const Separator = { 
    x:(can.width - 2)/2, 
    y:0, 
    height:10, 
    width:2, 
    color: "orange"
}

function drawRectangle(x,y,w,h,color){
    draw.fillStyle = color;
    draw.fillRect(x,y,w,h);
}

function drawCircle(x,y,r,color){
    draw.fillStyle = color;
    draw.beginPath();
    draw.arc(x,y,r,0,Math.PI*2,true);
    draw.closePath();
    draw.fill();
}

function drawScore(text,x,y){
    draw.fillStyle = "white";
    draw.font = "60px Arial";
    draw.fillText(text,x,y);
}

function drawSeparator(){
    for(let i=0;i<=can.height; i+=20){
        drawRectangle(Separator.x,Separator.y+i,Separator.width, Separator.height, Separator.color);
    }
}

function helper(){
    drawRectangle(0,0,can.width,can.height,"black");
    drawScore(user.score, can.width/4, can.height/5);
    drawScore(cpu.score, 3 * can.width/4, can.height/5);
    drawSeparator();
    drawRectangle(user.x,user.y,user.width,user.height,user.color);
    drawRectangle(cpu.x,cpu.y,cpu.width,cpu.height,cpu.color);
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

function updates(){
    if(ball.x - ball.radius <0){
        cpu.score++;
        restart();
    }else if(ball.x + ball.radius > can.width){
        user.score++;
        restart();
    }
    ball.x+=ball.vel_in_x_dir;
    ball.y+=ball.vel_in_y_dir;

    cpu_movement();
    //Top and Bottom
    if(ball.y - ball.radius<0 || ball.y + ball.radius>can.height)
        ball.vel_in_y_dir = -ball.vel_in_y_dir;
}

let player = (ball.x + ball.radius < can.width/2) ? user : cpu;
if(detect_collision(ball,player)){
    let collidePoint = (ball.y - (player.y + player.height/2));
    collidePoint = collidePoint/(player.height/2);
    ball.speed+=1;
}

function call_back(){
    updates();
    helper();
}

let fPS = 50;
let looper = setInterval(call_back,1000/fPS);

function restart(){
    ball.x = can.width/2;
    ball.y = can.height/2;
    ball.vel_in_x_dir = -ball.vel_in_x_dir;
    ball.speed = 5;   
}

can.addEventListener("mousemove",getMousePos);

function getMousePos(evt){
    let rect = can.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

function detect_collision(ball,player){
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return (
        player.left < ball.right &&
        player.right > ball.left &&
        player.top < ball.bottom &&
        player.bottom > ball.top
    );              

}

function cpu_movement(){
    if(cpu.y<ball.y)
        cpu.y+=5;
    else cpu.y-=5;
}


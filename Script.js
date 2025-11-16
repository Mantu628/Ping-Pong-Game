// Selecting The Canvas
let can = document.getElementById("table");
let draw = can.getContext('2d');

// User Object
const user = { 
  x: 0, 
  y: (can.height - 100) / 2, 
  width: 10, 
  height: 100, 
  score: 0, 
  color: "white"
};

// CPU Object
const cpu = { 
  x: can.width - 10, 
  y: (can.height - 100) / 2, 
  width: 10, 
  height: 100, 
  score: 0,
  color: "red"
};

// Ball Object
const ball = {                                                                                      
  x: can.width / 2, 
  y: can.height / 2, 
  radius: 10, 
  vel_in_x_dir: 5, 
  vel_in_y_dir: 5, 
  speed: 7, 
  color: "green"
};

// Separator Object
const Separator = { 
  x: (can.width - 2) / 2, 
  y: 0, 
  height: 10, 
  width: 2, 
  color: "orange"
};

function drawRectangle(x, y, w, h, color) {
  draw.fillStyle = color;
  draw.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  draw.fillStyle = color;
  draw.beginPath();
  draw.arc(x, y, r, 0, Math.PI * 2, true);
  draw.closePath();
  draw.fill();
}

function drawScore(text, x, y) {
  draw.fillStyle = "white";
  draw.font = "60px Arial";
  draw.fillText(text, x, y);
}

function drawSeparator() {
  for (let i = 0; i <= can.height; i += 20) {
    drawRectangle(Separator.x, Separator.y + i, Separator.width, Separator.height, Separator.color);
  }
}

function helper() {
  drawRectangle(0, 0, can.width, can.height, "black");
  drawScore(user.score, can.width / 4, can.height / 5);
  drawScore(cpu.score, 3 * can.width / 4, can.height / 5);
  drawSeparator();
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function detect_collision(ball, player) {
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

function cpu_movement() {
  let center = cpu.y + cpu.height / 2;
  if (center < ball.y - 15) cpu.y += 5;
  else if (center > ball.y + 15) cpu.y -= 5;
  // Prevent CPU from going out of bounds
  if (cpu.y < 0) cpu.y = 0;
  if (cpu.y + cpu.height > can.height) cpu.y = can.height - cpu.height;
}

function updates() {
  // Score logic
  if (ball.x - ball.radius < 0) {
    cpu.score++;
    restart();
    return;
  } else if (ball.x + ball.radius > can.width) {
    user.score++;
    restart();
    return;
  }

  // Move the ball
  ball.x += ball.vel_in_x_dir;
  ball.y += ball.vel_in_y_dir;

  cpu_movement();

  // Bounce off top and bottom walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > can.height)
    ball.vel_in_y_dir = -ball.vel_in_y_dir;

  // Paddle collision
  let player = (ball.x < can.width / 2) ? user : cpu;
  if (detect_collision(ball, player)) {
    let collidePoint = (ball.y - (player.y + player.height / 2));
    collidePoint = collidePoint / (player.height / 2);
    let angleRad = collidePoint * (Math.PI / 4);
    let direction = (ball.x < can.width / 2) ? 1 : -1;
    ball.speed += 0.5;
    ball.vel_in_x_dir = direction * ball.speed * Math.cos(angleRad);
    ball.vel_in_y_dir = ball.speed * Math.sin(angleRad);
  }
}

function restart() {
  ball.x = can.width / 2;
  ball.y = can.height / 2;
  ball.speed = 7;
  ball.vel_in_x_dir = (Math.random() > 0.5 ? 1 : -1) * 5;
  ball.vel_in_y_dir = (Math.random() > 0.5 ? 1 : -1) * 5;
  user.y = (can.height - user.height) / 2;
  cpu.y = (can.height - cpu.height) / 2;
}

can.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = can.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
  // Prevent user paddle from going out of bounds
  if (user.y < 0) user.y = 0;
  if (user.y + user.height > can.height) user.y = can.height - user.height;
}

function call_back() {
  updates();
  helper();
}

let fPS = 50;
let looper = setInterval(call_back, 1000 / fPS);

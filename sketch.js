let x = 100;
let y = 100;
let xSpeed = 3;
let ySpeed = 3;
const radius = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  x += xSpeed;
  y += ySpeed;

  if (x - radius <= 0 || x + radius >= width) {
    xSpeed *= -1;
  }

  if (y - radius <= 0 || y + radius >= height) {
    ySpeed *= -1;
  }

  circle(x, y, radius * 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

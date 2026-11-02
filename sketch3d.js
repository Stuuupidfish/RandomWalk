let person =
{
  x: 0,
  y: 0,
  z: 0,
  path: []
};
let zoom = 1;
let speed = 1000;
let defaultSpacing = 50;
let zoomInButton;
let zoomOutButton;
let resetButton;
let startOverButton;
let lastSpawn = 0;
let start = true;
let returnedHome = false;
let steps = 0;
let messageTextSize = 20;
let gameOverMessage;

function setup()
{
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera(700, -500, 800, 0, 0, 0, 0, 1, 0);
  textSize(messageTextSize);
  lastSpawn = millis();

  gameOverMessage = createDiv("");
  gameOverMessage.class("game-over-message");
  gameOverMessage.hide();

  zoomInButton = createButton("+");
  zoomInButton.position(20, 20);
  zoomInButton.mousePressed(() => zoom = min(zoom + 0.1, 4));
  zoomInButton.class("zoom-button");

  zoomOutButton = createButton("-");
  zoomOutButton.position(60, 20);
  zoomOutButton.mousePressed(() => zoom = max(zoom - 0.1, 0.2));
  zoomOutButton.class("zoom-button");

  resetButton = createButton("reset");
  resetButton.position(100, 20);
  resetButton.mousePressed(() => zoom = 1);
  resetButton.class("zoom-button reset-button");

  startOverButton = createButton("start over");
  startOverButton.position(165, 20);
  startOverButton.mousePressed(startOver);
  startOverButton.class("zoom-button start-over-button");
}

function startOver()
{
  person.x = 0;
  person.y = 0;
  person.z = 0;
  person.path = [];
  zoom = 1;
  lastSpawn = millis();
  start = true;
  returnedHome = false;
  steps = 0;
}

function walk()
{
  steps++;
  start = false;
  const direction = int(random(0, 6));

  if (direction === 0)
  {
    person.path.push("U");
    person.y -= 1;
  }
  else if (direction === 1)
  {
    person.path.push("D");
    person.y += 1;
  }
  else if (direction === 2)
  {
    person.path.push("L");
    person.x -= 1;
  }
  else if (direction === 3)
  {
    person.path.push("R");
    person.x += 1;
  }
  else if (direction === 4)
  {
    person.path.push("F");
    person.z += 1;
  }
  else
  {
    person.path.push("B");
    person.z -= 1;
  }
}

function drawGrid(spacing)
{
  const gridSize = ceil(max(width, height) / spacing) * spacing;

  stroke(55);
  strokeWeight(1);

  for (let value = -gridSize; value <= gridSize; value += spacing)
  {
    line(value, -gridSize, 0, value, gridSize, 0);
    line(-gridSize, value, 0, gridSize, value, 0);
    line(value, 0, -gridSize, value, 0, gridSize);
    line(0, value, -gridSize, 0, value, gridSize);
    line(-gridSize, 0, value, gridSize, 0, value);
    line(0, -gridSize, value, 0, gridSize, value);
  }

  stroke(180, 70, 70);
  line(-gridSize, 0, 0, gridSize, 0, 0);
  stroke(70, 180, 70);
  line(0, -gridSize, 0, 0, gridSize, 0);
  stroke(70, 100, 220);
  line(0, 0, -gridSize, 0, 0, gridSize);
}

function drawPath(spacing)
{
  let currentX = 0;
  let currentY = 0;
  let currentZ = 0;

  stroke(0, 255, 255);
  strokeWeight(max(2, zoom * 3));

  for (const direction of person.path)
  {
    const previousX = currentX;
    const previousY = currentY;
    const previousZ = currentZ;

    if (direction === "U")
    {
      currentY -= 1;
    }
    else if (direction === "D")
    {
      currentY += 1;
    }
    else if (direction === "L")
    {
      currentX -= 1;
    }
    else if (direction === "R")
    {
      currentX += 1;
    }
    else if (direction === "F")
    {
      currentZ += 1;
    }
    else
    {
      currentZ -= 1;
    }

    line(
      previousX * spacing, previousY * spacing, previousZ * spacing,
      currentX * spacing, currentY * spacing, currentZ * spacing
    );
  }
}

function draw()
{
  background(0);

  if (!start && person.x === 0 && person.y === 0 && person.z === 0)
  {
    returnedHome = true;
  }

  if (!returnedHome && millis() - lastSpawn >= speed)
  {
    walk();
    lastSpawn = millis();
  }

  const spacing = zoom * defaultSpacing;

  orbitControl();
  ambientLight(120);
  directionalLight(255, 255, 255, 0, 1, -1);

  drawGrid(spacing);
  drawPath(spacing);

  push();
  noStroke();
  fill(255, 100, 100);
  translate(person.x * spacing, person.y * spacing, person.z * spacing);
  sphere(min(10, spacing * 0.5));
  pop();

  if (returnedHome)
  {
    gameOverMessage.html(
      "You returned home after " + steps + " steps.<br>" +
      "Press start over to play again."
    );
    gameOverMessage.show();
  }
  else
  {
    gameOverMessage.hide();
  }
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
}

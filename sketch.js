let person = 
{
  x : 0,
  y : 0,
  path : []
}
let zoom = 1;
let speed = 1000; //how fast person walks
let defaultSpacing = 50; //in px
let zoomInButton;
let zoomOutButton;
let resetButton;
let startOverButton;
let lastSpawn = 0;
let start = true;
let returnedHome = false;
let steps = 0;
let messageTextSize = 20;

function setup() 
{
  createCanvas(windowWidth, windowHeight);
  textSize(messageTextSize);

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
  startOverButton.mousePressed(() => {
    person.x = 0;
    person.y = 0;
    person.path = [];
    zoom = 1;
    lastSpawn = millis();
    start = true;
    returnedHome = false;
    steps = 0;
  });
  startOverButton.class("zoom-button start-over-button");
}

function walk()
{
  steps++;
  start = false;
  let dir = int(random(0,4));
  if (dir == 0)
  {
    person.path.push('U');
    person.y -= 1;
  }
  else if (dir == 1)
  {
    person.path.push('D');
    person.y += 1;
  }
  else if (dir == 2)
  {
    person.path.push('L')
    person.x -= 1;
  }
  else
  {
    person.path.push('R')
    person.x += 1;
  }
}

function drawPath()
{
  const spacing = zoom * defaultSpacing;
  const centerX = width / 2;
  const centerY = height / 2;
  let currentX = 0;
  let currentY = 0;

  stroke(0, 255, 255);
  strokeWeight(max(2, zoom * 3));

  for (let i = 0; i < person.path.length; i++)
  {
    const previousX = currentX;
    const previousY = currentY;

    if (person.path[i] === 'U')
    {
      currentY -= 1;
    }
    else if (person.path[i] === 'D')
    {
      currentY += 1;
    }
    else if (person.path[i] === 'L')
    {
      currentX -= 1;
    }
    else
    {
      currentX += 1;
    }

    line(
      centerX + previousX * spacing,
      centerY + previousY * spacing,
      centerX + currentX * spacing,
      centerY + currentY * spacing
    );
  }
}

function draw() 
{
  background(0);

  if (!start && person.x === 0 && person.y === 0)
  {
    returnedHome = true;
  }
  
  if (!returnedHome)
  {
    let curElapsed = millis();
    if (curElapsed - lastSpawn >= speed)
    {
      walk();
      lastSpawn = curElapsed;
    }
  }

  const spacing = zoom * defaultSpacing;
  const centerX = width / 2;
  const centerY = height / 2;

  stroke(70);
  strokeWeight(1);

  for (let x = centerX; x <= width; x += spacing)
  {
    line(x, 0, x, height);
  }
  for (let x = centerX - spacing; x >= 0; x -= spacing)
  {
    line(x, 0, x, height);
  }
  for (let y = centerY; y <= height; y += spacing)
  {
    line(0, y, width, y);
  }
  for (let y = centerY - spacing; y >= 0; y -= spacing)
  {
    line(0, y, width, y);
  }

  stroke(130);
  line(centerX, 0, centerX, height);
  line(0, centerY, width, centerY);

  drawPath();

  const playerX = centerX + person.x * spacing;
  const playerY = centerY + person.y * spacing;
  noStroke();
  fill(255, 100, 100);
  circle(playerX, playerY, min(15, spacing * 0.5));

  if(returnedHome)
  {
    fill(255);
    text(
      "You returned home after " + steps + " steps.\nPress start over to play again.",
      windowWidth/2 - 200,
      windowHeight/2 - 100
    );
  }
}

function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}

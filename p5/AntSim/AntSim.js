var displayLabels = false;
var displayMarkerDirections = false;
var displayAntSenseRange = false;

var antSpawnDelay = 0.25;
var bugSpawnDelay = 2;
var maxAnts = 50;
var maxBugs = 3;
var antHillRadius = 100;
var fruitBaseSpeed = 0.1;
var maxSimTime = 999;

var antHill;
var food = [];
var bugs = [];
var lastFrameMillis = 0;
var bugSpawnTime = 0.0;
var simTime = 0;
var gameOver_ = false;

//stats
var foodCollected = 0;
var killedAntsThroughBugs = 0;
var killedBugs = 0;
var totalscore = 0;

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  lastFrameMillis = millis();
  
  antHill = new AntHill(createVector(width/2, height/2), createVector(0, 0), createVector(50, 50));
  
  for (let i=0; i<4; i++) {
    spawnSugarHill();
  }
  
  for (let i=0; i<3; i++) {
    spawnFruit();
  }
  
  for (let i=0; i<maxBugs; i++) {
    spawnBug();
  }
}


function draw() {
  const deltaTime = (millis() - lastFrameMillis) / 1000;
  simTime += deltaTime;
  if (simTime >= maxSimTime) {
    gameOver();
  }
  if (gameOver_) return;
  
  background(245, 222, 179);
  
  if (bugs.length < maxBugs) {
    bugSpawnTime += deltaTime;  
    
    if (bugSpawnTime > bugSpawnDelay) {
      spawnBug();
      bugSpawnTime = 0;
    }
  } else {
    bugSpawnTime = 0;
  }
  
  for (let b of bugs) {
    b.update(deltaTime);
    b.render();
    
    if (b.hitsWalls()) {
      b.rotation.rotate(radians(180));
    }
  }
  
  antHill.update(deltaTime);
  
  for (let i=food.length-1; i>=0; i--) {
    let f = food[i];
    
    f.update(deltaTime);
    f.render();
    
    if (f.amount == 0) {
      food.splice(food.indexOf(f), 1);
      
      if (f instanceof Fruit)
        spawnFruit();
      else 
        spawnSugarHill();
    }
  }
  
  antHill.render();
  
  // draw stats
  fill(220, 220, 220, 120);
  rect(0, 0, 180, 110);
  fill(0, 100, 0);
  text("Sim time:          " + Math.floor(simTime) + "/" + maxSimTime + "s", 10, 20);
  text("Ants alive:        " + antHill.antCount, 10, 40);
  text("Ants killed:       " + killedAntsThroughBugs, 10, 60);
  text("Food collected: " + foodCollected, 10, 80);
  text("Bugs killed:       " + killedBugs, 10, 100);
  
  lastFrameMillis = millis();
}

function mousePressed() {
  antHill.spawnAntAtPos(mouseX, mouseY);
}

function spawnSugarHill() {
  let amount = Math.floor(random(50, 250));
  let fScale = createVector(10 + amount * 0.08, 10 + amount * 0.08);
  let f = new Food(getRandomPoint(), createVector(0, 0), fScale, amount);
  food.push(f);
}

function spawnFruit() {
  let amount = 500;
  let f = new Fruit(getRandomPoint(), createVector(0, 0), createVector(20, 20), amount);
  food.push(f);
}

function spawnBug() {
  let b = new Bug(getRandomPoint(), getRandomRotation(), createVector(10, 6));
  bugs.push(b);
}

function getRandomPoint() {
  let rp = createVector(random(20, width-20), random(20, height-20));
  while (rp.dist(antHill.position) < antHillRadius) {
    rp = createVector(random(20, width-20), random(20, height-20));
  }
  return rp;
}

function getRandomRotation() {
  return createVector(random(-1, 1), random(-1, 1));
}

function gameOver() {
  gameOver_ = true;
}

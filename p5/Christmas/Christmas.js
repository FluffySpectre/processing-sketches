var quantity = 300;
var xPosition = [];
var yPosition = [];
var flakeSize = [];
var direction = [];
var minFlakeSize = 1;
var maxFlakeSize = 6;
var snowColor = 220;
var snowSpeed = 0.6;

var shootingStars = [];
var moon;
var santa; 
var houses = [];
var nextShootingStar;
var tree;
var snowman;
var poetryOverlay;
var bellSound;

function preload() {
  soundFormats('mp3', 'ogg');
  bellSound = loadSound('assets/bells.mp3');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  noStroke();

  for(var i = 0; i < quantity; i++) {
    flakeSize[i] = round(random(minFlakeSize, maxFlakeSize));
    xPosition[i] = random(0, width);
    yPosition[i] = random(0, height);
    direction[i] = round(random(0, 1));
  }
  
  moon = new Moon(width/4, 200);
  tree = new Tree(width*0.8, height/2);
  santa = new Santa();
  snowman = new Snowman(width*0.93, height - 200);
  poetryOverlay = new PoetryOverlay(bellSound);
  
  houses.push(new SmallHouse(100, height*(4/5)-60));
  houses.push(new SmallHouse(180, height*(4/5)-60));
  houses.push(new SmallHouse(260, height*(4/5)-60));
  
  nextShootingStar = millis() + random(30000, 80000);
}

function draw() {
  background(0,30,80);
  
  moon.update();
  moon.render();
  
  if (millis() > nextShootingStar) {
    shootingStars.push(new ShootingStar(floor(random(50, width-100)), 0));
    nextShootingStar = millis() + random(30000, 80000);
  }
  
  for(var i=shootingStars.length-1; i>=0; i--) {
    var s = shootingStars[i];
    s.update();
    s.render();
    
    if (s.isDead()) {
      shootingStars.splice(i, 1);
    }
  }
  
  fill(snowColor);
  rect(0,height*(4/5),width,height/5);
  
  snowman.update();
  snowman.render();
  
  tree.update();
  tree.render();
  
  santa.update();
  santa.render();
  
  for (var i=0; i<houses.length; i++) {
    var h = houses[i];
    h.update();
    h.render();
  }

  drawSnow();  
  
  poetryOverlay.update();
  poetryOverlay.render();
}

function drawSnow() {
  for(var i = 0; i < xPosition.length; i++) {
    
    ellipse(xPosition[i], yPosition[i], flakeSize[i], flakeSize[i]);
    
    if(direction[i] == 0) {
      xPosition[i] += map(flakeSize[i], minFlakeSize, maxFlakeSize, .1, .5);
    } else {
      xPosition[i] -= map(flakeSize[i], minFlakeSize, maxFlakeSize, .1, .5);
    }
    
    yPosition[i] += (flakeSize[i] + direction[i]) * snowSpeed; 
    
    if(xPosition[i] > width + flakeSize[i] || xPosition[i] < -flakeSize[i] || yPosition[i] > height + flakeSize[i]) {
      xPosition[i] = random(0, width);
      yPosition[i] = -flakeSize[i];
    } 
  }
}
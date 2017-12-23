var quantity = 300;
var xPosition = [];
var yPosition = [];
var flakeSize = [];
var direction = [];
var minFlakeSize = 1;
var maxFlakeSize = 6;
var snowColor = 255;
var snowSpeed = 0.6;

var shootingStars = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(60);
  noStroke();
  
  for(var i = 0; i < quantity; i++) {
    flakeSize[i] = round(random(minFlakeSize, maxFlakeSize));
    xPosition[i] = random(0, width);
    yPosition[i] = random(0, height);
    direction[i] = round(random(0, 1));
  }
  
  shootingStars.push(new ShootingStar(200, 200));
}

function draw() {
  background(0,30,80);
  fill(snowColor);
  rect(0,height*(4/5),width,height/5);
  drawSnowMan();
  drawTree();
  
  for(var i=shootingStars.length-1; i>=0; i--) {
    var s = shootingStars[i];
    s.update();
    s.render();
    
    if (s.isDead()) {
      shootingStars.splice(i, 1);
    }
  }
  
  drawSnow();
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

function drawSnowMan() {
  var centerX = width*0.75;
  var centerY = height - 200;
  var offsetHand = 30;
  strokeWeight(1);
  stroke(210);
  fill(snowColor);
  // Bottom circle (x,y,width,height) 
  
  ellipse(centerX,centerY+70,100,100);
  ellipse(centerX,centerY,80,80);
  
  push();
  translate(centerX,centerY-50);
  ellipse(0,0,60,60);
  // eyes
  fill(30);
  ellipse(-10, -10, 10, 10);
  ellipse(10, -10, 10, 10);
  // nose
  fill(255,165,0);
  ellipse(0, 0, 5, 5);
  // mouth
  fill(30);
  ellipse(-10, 10, 5, 5);
  ellipse(-6, 14, 5, 5);
  ellipse(0, 14, 5, 5);
  ellipse(6, 14, 5, 5);
  ellipse(10, 10, 5, 5);
  pop();
  
  // hands
  push();
  stroke(193,126,42);
  strokeWeight(3);
  line(centerX-100,centerY-offsetHand,centerX-40,centerY - 15);
  line(centerX+100,centerY-offsetHand,centerX+40,centerY - 15);
  pop();
}

function drawTree() {
  var centerX = width/2;
  var centerY = height/2;
  
  push();
  translate(centerX, centerY);
  //scale(1.2, 1.2);
  // tree
  fill(0, 205, 50);
  triangle(-100, 300, 0, 0, 100, 300);
  // stump
  fill(137, 100, 90);
  rect(-25, 300, 50, 60);  
  
  // star
  noStroke();
  fill(255, 236, 23);
  triangle(-25, 45, 0, 0, 25, 45);
  translate(0, 17);
  triangle(-25, 0, 0, 45, 25, 0);
  
  pop();
}
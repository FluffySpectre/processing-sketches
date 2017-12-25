var quantity = 200;
var minFlakeSize = 2;
var maxFlakeSize = 20;
var snowColor = 220;
var snowSpeed = 0.3;
var snowFlakeSpritesheet;
var snowFlakeTextures = [];

var snowSystem;
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
  
  // load snow flake spritesheet
  snowFlakeSpritesheet = loadImage('assets/snowflakes.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  noStroke();
  
  // cut the different textures out of the spritesheet
  for (var x = 0; x < snowFlakeSpritesheet.width; x += 43) {
    var img = snowFlakeSpritesheet.get(x, 0, 43, 43);
    snowFlakeTextures.push(img);
  }
  
  // setup snow
  snowSystem = new ParticleSystem(createVector(0, 0));
  for(var i = 0; i < quantity; i++) {
    snowSystem.addParticle(new SnowParticle(createVector(random(0, width), random(0, height)), random(snowFlakeTextures)));
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
  background(0, 30, 80);
  
  moon.run();
  
  if (millis() > nextShootingStar) {
    shootingStars.push(new ShootingStar(floor(random(50, width-100)), 0));
    nextShootingStar = millis() + random(30000, 80000);
  }
  for (var i=shootingStars.length-1; i>=0; i--) {
    shootingStars[i].run();
    if (shootingStars[i].isDead()) {
      shootingStars.splice(i, 1);
    }
  }
  
  fill(snowColor);
  rect(0,height*(4/5),width,height/5);
  
  snowman.run();
  tree.run();
  santa.run();
  
  for (var i=0; i<houses.length; i++) {
    houses[i].run();
  }
  
  snowSystem.run();
  while (snowSystem.particles.length < quantity) {
    snowSystem.addParticle(new SnowParticle(createVector(random(0, width), -43), random(snowFlakeTextures)));
  }
  
  poetryOverlay.run();
}
boolean displayLabels = false;
boolean displayMarkerDirections = false;
float antSpawnDelay = 1;
float bugSpawnDelay = 2;
int maxAnts = 25;
int maxBugs = 3;
float antHillRadius = 100;
float fruitBaseSpeed = 0.1;
int maxSimTime = 180;

AntHill antHill;
ArrayList<Food> food = new ArrayList<Food>();
ArrayList<Bug> bugs = new ArrayList<Bug>();
float lastFrameMillis = 0;
float bugSpawnTime = 0.0;
float simTime = 0;
boolean gameOver = false;

//stats
int foodCollected = 0;
int killedAntsThroughBugs = 0;
int killedBugs = 0;
int totalscore = 0;

void setup() {
  size(500, 500);
  
  lastFrameMillis = millis();
  
  antHill = new AntHill(new PVector(250, 250), new PVector(0, 0), new PVector(50, 50));
  
  for (int i=0; i<4; i++) {
    spawnSugarHill();
  }
  
  for (int i=0; i<3; i++) {
    spawnFruit();
  }
  
  for (int i=0; i<maxBugs; i++) {
    spawnBug();
  }
}

void draw() {
  float deltaTime = (millis() - lastFrameMillis) / 1000;
  simTime += deltaTime;
  if (simTime >= maxSimTime) {
    gameOver();
  }
  if (gameOver) return;
  
  background(245, 222, 179);
  
  if (bugs.size() < maxBugs) {
    bugSpawnTime += deltaTime;  
    
    if (bugSpawnTime > bugSpawnDelay) {
      spawnBug();
      bugSpawnTime = 0;
    }
  } else {
    bugSpawnTime = 0;
  }
  
  for (Bug b : bugs) {
    b.update(deltaTime);
    b.render();
    
    if (b.hitsWalls()) {
      b.rotation.rotate(radians(180));
    }
  }
  
  antHill.update(deltaTime);
  
  for (int i=food.size()-1; i>=0; i--) {
    Food f = food.get(i);
    
    f.update(deltaTime);
    f.render();
    
    if (f.amount == 0) {
      food.remove(i);
      
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
  text("Sim time:          " + (int)simTime + "/" + maxSimTime + "s", 10, 20);
  text("Ants alive:        " + antHill.antCount, 10, 40);
  text("Ants killed:       " + killedAntsThroughBugs, 10, 60);
  text("Food collected: " + foodCollected, 10, 80);
  text("Bugs killed:       " + killedBugs, 10, 100);
  
  lastFrameMillis = millis();
}

void mousePressed() {
  antHill.spawnAntAtPos(mouseX, mouseY);
}

void spawnSugarHill() {
  int amount = (int)random(50, 250);
  PVector fScale = new PVector(10 + amount * 0.08, 10 + amount * 0.08);
  Food f = new Food(getRandomPoint(), new PVector(0, 0), fScale, amount);
  food.add(f);
}

void spawnFruit() {
  int amount = 500;
  Fruit f = new Fruit(getRandomPoint(), new PVector(0, 0), new PVector(20, 20), amount);
  food.add(f);
}

void spawnBug() {
  Bug b = new Bug(getRandomPoint(), getRandomRotation(), new PVector(10, 6));
  bugs.add(b);
}

PVector getRandomPoint() {
  PVector rp = new PVector(random(20, 500-20), random(20, 500-20));
  while (rp.dist(antHill.position) < antHillRadius) {
    rp = new PVector(random(20, 500-20), random(20, 500-20));
  }
  return rp;
}

PVector getRandomRotation() {
  return new PVector(random(-1, 1), random(-1, 1));
}

void gameOver() {
  gameOver = true;
}
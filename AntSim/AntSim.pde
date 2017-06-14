boolean displayAntNames = true;
float antSpawnDelay = 2;
int maxAnts = 15;

AntHill antHill;
ArrayList<Food> food = new ArrayList<Food>();
ArrayList<Bug> bugs = new ArrayList<Bug>();
float lastFrameMillis = 0;

//stats
int foodCollected = 0;
int killedAntsThroughBugs = 0;

void setup() {
  size(500, 500);
  
  lastFrameMillis = millis();
  
  antHill = new AntHill(new PVector(250, 250), new PVector(0, 0), new PVector(50, 50));
  
  for (int i=0; i<3; i++) {
    spawnSugarHill();
  }
  
  for (int i=0; i<3; i++) {
    Bug b = new Bug(getRandomPoint(), getRandomRotation(), new PVector(10, 6));
    bugs.add(b);
  }
}

void draw() {
  float deltaTime = (millis() - lastFrameMillis) / 1000;
  
  background(245, 222, 179);
  
  antHill.update(deltaTime);
  antHill.render();
  
  for (Bug b : bugs) {
    b.update(deltaTime);
    b.render();
    
    if (b.hitsWalls()) {
      b.rotation.rotate(radians(180));
    }
  }
  
  ArrayList<Food> emptyFood = new ArrayList<Food>();
  for (Food f : food) {
    f.render();
    
    if (f.amount == 0) {
      emptyFood.add(f);
    }
  }
  if (emptyFood.size() > 0) {
    food.removeAll(emptyFood);
    
    for (int i=0; i<emptyFood.size(); i++) {
      spawnSugarHill();
    }
    
    emptyFood = null;
  }
  
  // draw stats
  fill(220, 220, 220, 200);
  rect(0, 0, 150, 70);
  fill(0, 100, 0);
  text("Ants alive: " + antHill.antCount, 10, 20);
  text("Ants killed: " + killedAntsThroughBugs, 10, 40);
  text("Food collected: " + foodCollected, 10, 60);
  
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

PVector getRandomPoint() {
  return new PVector(random(20, 500-20), random(20, 500-20));
}

PVector getRandomRotation() {
  return new PVector(random(-1, 1), random(-1, 1));
}
boolean displayAntNames = true;

AntHill antHill;

void setup() {
  size(500, 500);
  
  antHill = new AntHill(new PVector(250, 250), new PVector(random(-1, 1), random(-1, 1)), new PVector(50, 50));
  for (int i=0; i<25; i++) {
    antHill.spawnAnt();
  }
}

void draw() {
  background(245, 222, 179);
  
  antHill.update();
  antHill.render();
}
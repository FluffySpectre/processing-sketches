boolean displayAntNames = true;

AntHill antHill;

float lastFrameMillis = 0;

void setup() {
  size(500, 500);
  
  lastFrameMillis = millis();
  
  antHill = new AntHill(new PVector(250, 250), new PVector(0, 0), new PVector(50, 50));
  for (int i=0; i<25; i++) {
    antHill.spawnAnt();
  }
}

void draw() {
  float deltaTime = (millis() - lastFrameMillis) / 1000;
  
  background(245, 222, 179);
  
  antHill.update(deltaTime);
  antHill.render();
  
  lastFrameMillis = millis();
}
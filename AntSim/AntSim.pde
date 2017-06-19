float lastFrameMillis = 0;
Environment environment;

//stats
int foodCollected = 0;
int killedAntsThroughBugs = 0;
int killedBugs = 0;

void setup() {
  size(500, 500);
  
  lastFrameMillis = millis();
  
  SimSettings simSettings = new SimSettings();
  environment = new Environment(simSettings);
}

void draw() {
  float deltaTime = (millis() - lastFrameMillis) / 1000;
  
  background(245, 222, 179);
  
  environment.update(deltaTime);
  
  // draw stats
  fill(220, 220, 220, 200);
  rect(0, 0, 150, 90);
  fill(0, 100, 0);
  text("Ants alive: " + environment.antHill.antCount, 10, 20);
  text("Ants killed: " + killedAntsThroughBugs, 10, 40);
  text("Food collected: " + foodCollected, 10, 60);
  text("Bugs killed: " + killedBugs, 10, 80);
  
  lastFrameMillis = millis();
}

void mousePressed() {
  environment.antHill.spawnAntAtPos(mouseX, mouseY);
}

class SimSettings {
  // env
  boolean displayLabels = false;
  int maxSugarHills = 3;
  
  // bugs
  int maxBugs = 3;
  float bugSpawnDelay = 2;
  float bugTurnSpeed = 1;
  
  // ants
  int maxAnts = 25;
  float antSpawnDelay = 1;
  float antTurnSpeed = 2;
  float antSenseRange = 40;
  float antInteractionRange = 2;
  String[] antNames = new String[] { "Magda", "Horst", "Wilhelm", "Bernhard", "Anna", "Joachim", "Hannelore", "Björn", "Anja", "Carsten", "Benjamin" };
}
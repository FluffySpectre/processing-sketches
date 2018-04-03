float maxVelocity = 2.0;
float maxSteeringForce = 1.0;
float multSeekForce = 0.1;
float multAvoidanceForce = 0.8;
float maxAvoidanceForce = 50.0;
float viewDistance = 100.0;
int numObstacles = 25;

Vehicle v;
Obstacle[] obstacles;
PVector targetPos;
boolean mouseTracking = true;

void setup() {
  size(1024, 480);
  targetPos = new PVector(width/2, height/2);
  
  v = new Vehicle(20, height/2);
  
  generateObstacles();
}

void draw() {
  background(0);
  
  if (mouseTracking)
    targetPos = new PVector(mouseX, mouseY);
  
  noStroke();
  fill(0, 255, 0);
  ellipse(targetPos.x, targetPos.y, 30, 30);
  
  // update obstacles
  for (Obstacle o : obstacles) {
    o.render();
  }
  
  v.setTarget(targetPos);
  v.update();
  v.render();
}

void keyPressed() {
  if (key == ' ') {
    generateObstacles();
  }
}

void mousePressed() {
  mouseTracking = !mouseTracking;
}

void generateObstacles() {
  obstacles = new Obstacle[numObstacles];
  for (int i=0; i<obstacles.length; i++) {
    obstacles[i] = new Obstacle(random(width), random(height), random(20, 50));
  }
}
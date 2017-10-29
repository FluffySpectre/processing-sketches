float angle = 45;
float minBranchLength = 4;
int animDir = 1;
float animSpeed = 0.025;
float maxWhiggleAngle = 45.5;
float minWhiggleAngle = 44.5;
float nextLeafSpawn, leafSpawnDelay = 1500;
float leafAlpha = 1;
float timeForTreeReset;
boolean resetTree;

ArrayList<Leaf> leafs = new ArrayList<Leaf>();

void setup() {
  size(600, 600);
  
  nextLeafSpawn = millis() + leafSpawnDelay;
}

void draw() {
  background(51);
  stroke(255);
  pushMatrix();
  translate(width/2, height);
  
  if (timeForTreeReset > 0 && millis() > timeForTreeReset) {
    timeForTreeReset = millis() + 99999;
    resetTree = true;
  }
  if (resetTree) {
    leafAlpha += 0.005;
    if (leafAlpha >= 1.0) {
      leafAlpha = 1.0;
      resetTree = false;
      timeForTreeReset = 0;
    }
  }
  
  // draw the tree and animate it
  branch(150);
  animateTree();
  popMatrix();
  
  // draw the ground
  fill(100);
  rect(0, height-20, width, 20);
  
  // spawn some falling leafs, by random...
  if (timeForTreeReset == 0 && millis() > nextLeafSpawn) {
    leafs.add(new Leaf(random(100, width-100), random(200, 300)));
    nextLeafSpawn = millis() + leafSpawnDelay;
    
    leafAlpha -= 0.01;
    if (leafAlpha < 0) {
      leafAlpha = 0;
      timeForTreeReset = millis() + 15000;
      resetTree = false;
    }
  }
  
  // update the falling leafs
  for (int i=leafs.size()-1; i>0; i--) {
    Leaf l = leafs.get(i);
    
    l.update();
    l.render();
    
    if (l.isDead()) {
      leafs.remove(l);
    }
  }
}

void branch(float len) {
  stroke(121, 96, 76);
  strokeWeight(3);
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > minBranchLength) {
    pushMatrix();
    rotate(radians(angle));
    branch(len * 0.67);
    popMatrix();
    pushMatrix();
    rotate(radians(-angle));
    branch(len * 0.67);
    popMatrix();
  } else {
    // draw leaves
    pushMatrix();
    noStroke();
    fill(255, 0, 0, 128*leafAlpha);
    ellipse(0, 0, 15, 15);
    fill(255, 255, 0, 200*leafAlpha);
    ellipse(0, 0, 6, 6);
    popMatrix();
  }
}

void animateTree() {
  angle += animDir * animSpeed;
  if (angle < minWhiggleAngle || angle > maxWhiggleAngle) animDir *= -1;
}
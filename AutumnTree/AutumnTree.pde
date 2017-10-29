float angle = 45;
float minBranchLength = 4;
int animDir = 1;
float animSpeed = 0.025;
float maxWhiggleAngle = 45.5;
float minWhiggleAngle = 44.5;
float nextLeafSpawn, leafSpawnDelay = 1500;

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
  
  // draw the tree and animate it
  branch(150);
  animateTree();
  popMatrix();
  
  // draw the ground
  fill(100);
  rect(0, height-20, width, 20);
  
  // spawn some falling leafs, by random...
  if (millis() > nextLeafSpawn) {
    leafs.add(new Leaf(random(100, width-100), random(200, 300)));
    nextLeafSpawn = millis() + leafSpawnDelay;
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
    fill(255, 0, 0, 128);
    ellipse(0, 0, 15, 15);
    fill(255, 255, 0, 200);
    ellipse(0, 0, 6, 6);
    popMatrix();
  }
}

void animateTree() {
  angle += animDir * animSpeed;
  if (angle < minWhiggleAngle || angle > maxWhiggleAngle) animDir *= -1;
}
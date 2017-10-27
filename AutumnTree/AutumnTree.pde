float angle = 45;
float minBranchLength = 4;
int animDir = 1;
float animSpeed = 0.08;
float maxWhiggleAngle = 48;
float minWhiggleAngle = 42;
float nextLeafSpawn, leafSpawnDelay = 1000;

ArrayList<Leaf> leafs = new ArrayList<Leaf>();

void setup() {
  size(600, 600);
  
  nextLeafSpawn = millis() + leafSpawnDelay;
}

void draw() {
  background(51);
  stroke(255);
  translate(width/2, height);
  branch(150);
  
  animateTree();
  
  // draw ground
  pushMatrix();
  translate(0, height);
  fill(81, 61, 22);
  rect(0, -200, width, 20);
  popMatrix();
  
  for(Leaf l : leafs) {
    l.render();
  }
}

void branch(float len) {
  stroke(121, 96, 76);
  strokeWeight(3);
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 4) {
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
    
    // spawn some falling leafs here, by random...
    if (millis() > nextLeafSpawn) {
      leafs.add(new Leaf(random(-250, 250), random(-200, -100)));
      nextLeafSpawn = millis() + leafSpawnDelay;
    }
    
    // cull leafs which went offscreen
    //println(leafs.size());
    for (int i=leafs.size()-1; i>0; i--) {
      Leaf l = leafs.get(i);
      if (l.isDead()) {
        // the leaf is dead, remove it from the array...
        l.lieDown();
      }
      
      if (l.liesDown && l.clear()) {
        leafs.remove(l);
      }
    }
  }
}

void animateTree() {
  angle += animDir * animSpeed;
  if (angle < minWhiggleAngle || angle > maxWhiggleAngle) animDir *= -1;
  //println(angle);
}
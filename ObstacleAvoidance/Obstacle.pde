class Obstacle {
  PVector pos;
  float radius;
  
  Obstacle(float x, float y, float r) {
    pos = new PVector(x, y);
    radius = r;
  }
  
  void render() {
    pushMatrix();
    noFill();
    stroke(255, 0, 0);
    translate(pos.x, pos.y);
    ellipse(0, 0, radius*2, radius*2);
    popMatrix();
  }
}
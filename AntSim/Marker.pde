class Marker extends SimObject {
  float radius;
  PVector direction;
  float maxRadius;
  float spreadSpeed;
  boolean isDead;
  
  Marker(PVector position, PVector rotation, PVector scale, float radius, PVector direction) {
    super(position, rotation, scale);
    
    this.maxRadius = radius;
    this.direction = direction;
    
    // calculate spreadspeed
    spreadSpeed = radius / 4;
  }
  
  void update(float deltaTime) {   
    if (isDead) return;
    
    radius += spreadSpeed * deltaTime;
    if (radius > maxRadius)
      isDead = true;
  }
  
  void render() {
    if (isDead) return;
    
    noStroke();
    fill(240, 240, 10, map(radius, 0, maxRadius, 128, 0));
    ellipse(position.x, position.y, radius*2, radius*2);
    
    if (displayMarkerDirections) {
      // draw an arrow in the direction this marker is pointing
      PVector dir = PVector.add(position, direction);
      arrow(position.x, position.y, dir.x, dir.y, map(radius, 0, maxRadius, 255, 0));
    }
  }
  
  void arrow(float x1, float y1, float x2, float y2, float alpha) {
    pushMatrix();
    stroke(120, 120, 120, alpha);
    translate(x2, y2);
    float a = atan2(x1-x2, y2-y1);
    rotate(a);
    line(0, 0, -5, -5);
    line(0, 0, 5, -5);
    popMatrix();
  } 
}
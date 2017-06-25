class Marker extends SimObject {
  float radius;
  float startRadius;
  PVector direction;
  
  Marker(PVector position, PVector rotation, PVector scale, float radius, PVector direction) {
    super(position, rotation, scale);
    
    this.radius = radius;
    this.startRadius = radius;
    this.direction = direction;
  }
  
  void update(float deltaTime) {
    final float tweaker = 0.1;
    radius -=  tweaker * startRadius * deltaTime;
    if (radius < 0) radius = 0;
  }
  
  void render() {
    noStroke();
    fill(240, 240, 10, 120);
    ellipse(position.x, position.y, radius*2, radius*2);
    
    if (displayMarkerDirections) {
      // draw an arrow in the direction this marker is pointing
      PVector dir = PVector.add(position, direction);
      arrow(position.x, position.y, dir.x, dir.y, (radius / startRadius) * 255.0);
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
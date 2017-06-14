class Marker extends SimObject {
  float radius;
  float startRadius;
  SimObject direction;
  
  Marker(PVector position, PVector rotation, PVector scale, float radius, SimObject direction) {
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
  }
}
class Bug extends SimObject {
  float speed = 1.1;
  int vitality = 100;
  int maxVitality = 100;
  
  Bug(PVector position, PVector rotation, PVector scale) {
    super(position, rotation, scale);
  }
  
  void update(float deltaTime) {
    rotation.rotate(radians(random(-10, 10)));
    move();
  }
  
  void render() {
    pushMatrix();
    translate(position.x+scale.x/2, position.y+scale.y/2);
    rotate(rotation.heading());
    fill(0, 0, 230);
    rect(-scale.x/2, -scale.y/2, scale.x, scale.y);
    popMatrix();
    
    if (displayLabels) {
      fill(20);
      text(vitality, position.x - 20, position.y - 15);
    }
  }
  
  void move() {
    float vitalityFactor = 0.1 + (float)vitality / (float)maxVitality;
    position.x += rotation.x * speed * vitalityFactor;
    position.y += rotation.y * speed * vitalityFactor;
  }
}

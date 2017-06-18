class Bug extends Insect {
  float speed = 1.1;
  int vitality = 200;
  
  Bug(PVector position, PVector rotation, PVector scale) {
    super("Bug", position, rotation, scale);
  }
  
  void update(float deltaTime) {
    rotation.rotate(radians(random(-10, 10)));
    move();
  }
  
  void render() {
    pushMatrix();
    translate(position.x, position.y);
    rotate(rotation.heading());
    fill(0, 0, 230);
    rect(0, 0, scale.x, scale.y);
    popMatrix();
    
    if (displayLabels) {
      fill(20);
      text(vitality, position.x - 20, position.y - 15);
    }
  }
  
  void move() {
    position.x += rotation.x * speed;
    position.y += rotation.y * speed;
  }
}
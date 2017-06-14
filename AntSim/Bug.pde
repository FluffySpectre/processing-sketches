class Bug extends SimObject {
  float speed = 1.1;
  
  Bug(PVector position, PVector rotation, PVector scale) {
    super(position, rotation, scale);
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
    
    if (displayAntNames) {
      //fill(20);
      //text(name, position.x - 20, position.y - 15);
    }
  }
  
  void move() {
    position.x += rotation.x * speed;
    position.y += rotation.y * speed;
  }
}
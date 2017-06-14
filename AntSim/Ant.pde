class Ant extends SimObject {
  String name;
  int vitality = 100;
  float lifetime = 60;
  float speed = 2;
  AntHill antHill;
  
  Ant(String name, PVector position, PVector rotation, PVector scale, float speed, AntHill antHill) {
    super(position, rotation, scale);
    
    this.name = name;
    this.speed = speed;
    this.antHill = antHill;
  }
  
  void update(float deltaTime) {
    lifetime -= deltaTime;
    if (lifetime < 0) lifetime = 0;
    
    rotation.rotate(radians(random(-10, 10)));
    
    position.x += rotation.x * speed;
    position.y += rotation.y * speed;
  }
  
  void render() {
    pushMatrix();
    translate(position.x, position.y);
    rotate(rotation.heading());
    fill(20);
    rect(0, 0, scale.x, scale.y);
    popMatrix();
    
    if (displayAntNames)
      text(name, position.x - 20, position.y - 15);
  }
  
  void setMarker(float radius, java.lang.Object payload) {
    antHill.setMarkerAtPosition(this, position, radius, payload);
  }
  
  void setMarker(float radius) {
    antHill.setMarkerAtPosition(this, position, radius, null);
  }
  
  // MOVING
  void moveTo(PVector target) {
    turnTo(target);
    
  }
  
  void moveAwayFrom(PVector target) {
    
  }
  
  // TURNING
  void turnTo(PVector target) {
    PVector dir = PVector.sub(target, position);
    rotation = dir.normalize();
  }
  
  void turnAround() {
    
  }
  
  // SENSING
  void sees(Food food) {
    
  }
  
  // FOOD
  void take(Food food) {
    
  }
  
  void drop() {
  
  }
}
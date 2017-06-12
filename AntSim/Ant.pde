class Ant extends Object {
  String name;
  int vitality = 100;
  float lifetime = 60;
  float speed = 2;
  
  private float lastFrameMillis = 0;
  
  Ant(String name, PVector position, PVector rotation, PVector scale, float speed) {
    super(position, rotation, scale);
    
    this.name = name;
    this.speed = speed;
    
    lastFrameMillis = millis();
  }
  
  void update() {
    float deltaTime = (millis() - lastFrameMillis) / 1000;
    
    lifetime -= deltaTime;
    if (lifetime < 0) lifetime = 0;
    
    position.x += rotation.x * speed;
    position.y += rotation.y * speed;
    
    lastFrameMillis = millis();
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
  
  void sees(Food food) {
    
  }
  
  void take(Food food) {
    
  }
  
  void drop() {
  
  }
}
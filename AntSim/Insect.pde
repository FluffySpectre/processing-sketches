abstract class Insect extends SimObject {
  String name;
  int vitality = 100;
  float lifetime = 999;
  float speed = 2;
  float speedModificator = 1;
  int attackStrength = 10;
  color col;
  float remainingDistance = 0;
  
  Insect(String name, PVector position, PVector rotation, PVector scale) {
    super(position, rotation, scale);
    this.name = name;
  }
  
  boolean hitsWalls() {
    return (position.x >= width
            || position.x + scale.x <= 0
            || position.y >= height
            || position.y + scale.y <= 0);
  }
  
  void tick(float deltaTime) {}
}
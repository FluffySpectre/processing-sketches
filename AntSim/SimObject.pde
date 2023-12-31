abstract class SimObject {
  PVector position;
  PVector rotation;
  PVector scale;
  
  SimObject(PVector position, PVector rotation, PVector scale) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
  
  boolean intersecting(SimObject other) {
    return !(position.x >= other.position.x + other.scale.x
            || position.x + scale.x <= other.position.x
            || position.y >= other.position.y + other.scale.y
            || position.y + scale.y <= other.position.y);
  }
  
  boolean hitsWalls() {
    return (position.x >= width
            || position.x + scale.x <= 0
            || position.y >= height
            || position.y + scale.y <= 0);
  }
  
  void update(float deltaTime) {}
  void render() {}
}
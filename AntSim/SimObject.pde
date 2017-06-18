abstract class SimObject {
  PVector position;
  PVector rotation;
  PVector scale;
  SimSettings simSettings;
  
  SimObject(PVector position, PVector rotation, PVector scale, SimSettings simSettings) {
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
  
  void update(float deltaTime) {}
  void render() {}
}
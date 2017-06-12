class Object {
  PVector position;
  PVector rotation;
  PVector scale;
  
  Object(PVector position, PVector rotation, PVector scale) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
  
  boolean intersecting(Object other) {
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
  
  void turnTo(PVector target) {
    PVector dir = PVector.sub(target, position);
    rotation = dir.normalize();
  }
  
  void render() {}
}
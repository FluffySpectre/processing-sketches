class SimObject {
  constructor(position, rotation, scale) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
  
  intersecting(other) {
    return !(this.position.x >= other.position.x + other.scale.x
            || this.position.x + this.scale.x <= other.position.x
            || this.position.y >= other.position.y + other.scale.y
            || this.position.y + this.scale.y <= other.position.y);
  }
  
  hitsWalls() {
    return (this.position.x >= width
            || this.position.x + this.scale.x <= 0
            || this.position.y >= height
            || this.position.y + this.scale.y <= 0);
  }
  
  update(deltaTime) {}
  render() {}
}

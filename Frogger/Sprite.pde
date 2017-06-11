abstract class Sprite {
  float x, y, w, h;
  PImage sprite;
  
  Sprite(float x, float y, float w, float h, String sprite) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sprite = loadImage(sprite);
  }
  
  boolean intersecting(Sprite other) {
    return !(x >= other.x + other.w
            || x + w <= other.x
            || y >= other.y + other.h
            || y + h <= other.y);
  }
  
  void update() {}
  
  void render() {
    image(sprite, x, y, w, h);
  }
}
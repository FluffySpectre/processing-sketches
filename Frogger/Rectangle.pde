class Rectangle {
  float x, y, w, h;
  
  Rectangle(float x, float y, float w, float h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  boolean intersecting(Rectangle other) {
    return !(x >= other.x + other.w
            || x + w <= other.x
            || y >= other.y + other.h
            || y + h <= other.y);
  }
}
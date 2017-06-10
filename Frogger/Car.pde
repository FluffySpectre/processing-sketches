class Car extends Rectangle {
  float speed;
  
  Car(float x, float y, float w, float h, float s) {
    super(x, y, w, h);
    
    speed = s;
  }
  
  void move() {
    x += speed;
    
    if (x > width+w) {
      x = -w;
    } else if (x < -w-grid) {
      x = width+w;
    }
  }
  
  void show() {
    fill(230);
    rect(x, y, w, h);
  }
}
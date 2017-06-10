class Log extends Car {
  Log(float x, float y, float w, float h, float s) {
    super(x, y, w, h, s);
  }
  
  void show() {
    fill(130, 82, 1);
    rect(x, y, w, h);
  }
}
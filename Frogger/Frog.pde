class Frog extends Rectangle {
  Log attached = null;
  
  Frog(float x, float y, float w) {
    super(x, y, w, w);
  }
  
  void attach(Log log) {
    attached = log;
  }
  
  void update() {
    if (attached != null) {
      x += attached.speed;
    }
    
    x = constrain(x, 0, width-w);
    y = constrain(y, 0, height-w);
  }
  
  void move(float xDir, float yDir) {
    x += xDir * grid;
    y += yDir * grid;
  }
  
  void show() {
    fill(45, 189, 58);
    rect(x, y, w, h);
  }
}
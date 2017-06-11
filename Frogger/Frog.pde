class Frog extends Sprite {
  MoveableSprite attached = null;
  boolean isControllable = true;
  
  Frog(float x, float y, float w, String sprite) {
    super(x, y, w, w, sprite);
  }
  
  void attach(MoveableSprite log) {
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
    if (!isControllable) return;
    
    x += xDir * grid;
    y += yDir * grid;
  }
  
  void render() {
    image(sprite, x, y, w, h);
  }
}
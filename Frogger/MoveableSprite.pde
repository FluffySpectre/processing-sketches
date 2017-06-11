class MoveableSprite extends Sprite {
  float speed;
  
  MoveableSprite(float x, float y, float w, float h, String sprite, float s) {
    super(x, y, w, h, sprite);
    
    speed = s;
  }
  
  void update() {
    x += speed;
    
    if (x > width+w) {
      x = -w;
    } else if (x < -w-grid) {
      x = width+w;
    }
  }
}
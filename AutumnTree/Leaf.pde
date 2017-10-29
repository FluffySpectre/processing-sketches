class Leaf {
  private final float lifetime = 20000;
  private float x, y;
  private float gravity = 1;
  private float a = 0.0;
  private float inc = TWO_PI/80.0;
  private float timeOfGroundHit;
  
  public Leaf(float x, float y) {
    this.x = x;
    this.y = y;
  }
  
  public void update() {
    if (timeOfGroundHit == 0 && hitsTheGround()) {
      y = height-20-2.5;
      timeOfGroundHit = millis();
    }
    
    if (timeOfGroundHit == 0) {
      // update position by applying some gravity (Maybe some rotation too ???)
      y += gravity;
      
      float s = sin(a);
      x += 0 + s * 2.0;
      a += inc;
      
      // reset the counter if a full circle was reached
      if (a > TWO_PI)
        a = 0;
    }
  }
  
  public void render() {
    // draw this leaf
    pushMatrix();
    fill(255, 0, 0, 128);
    ellipse(x, y, 10, 5);
    popMatrix();
  }
  
  public boolean hitsTheGround() {
    if (y >= height-20-2.5)
      return true;
    return false;
  }
  
  public boolean isDead() {
    if (timeOfGroundHit == 0) 
      return false;
    if (millis() > timeOfGroundHit + lifetime)
      return true;
    return false;
  }
}
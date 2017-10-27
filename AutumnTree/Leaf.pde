class Leaf {
  private float x, y;
  private float gravity = 1;
  public boolean liesDown;
  public float lifetime = 20000;
  public float timeOfGroundHit;
  
  public Leaf(float initialX, float initialY) {
    x = initialX;
    y = initialY;
  }
   
  float a = 0.0;
  float inc = TWO_PI/25.0;
  public void render() {
    if (!liesDown) {
      // update position by applying some gravity (Maybe some rotation too ???)
      y += gravity;
      
      x += random(-1, 1) + sin(a) * 2.0;
      a = a + inc;
    }
    
    // draw this leaf
    pushMatrix();
    fill(255, 0, 0, 128);
    ellipse(x, y, 10, 5);
    popMatrix();
  }
  
  public void lieDown() {
    if (liesDown) return;
    
   // println("Lie down called!");
    y = 147;
    liesDown = true;
    timeOfGroundHit = millis();
  }
  
  public boolean isDead() {
    if (y > 147)
      return true;
    return false;
  }
  
  public boolean clear() {
    //println(millis() + " - " + (timeOfGroundHit + lifetime));
    if (millis() > timeOfGroundHit + lifetime)
      return true;
    return false;
  }
}
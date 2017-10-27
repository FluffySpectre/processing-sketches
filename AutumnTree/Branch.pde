class Branch {
  private float len;
  private color col;
  private float angle;
  private Branch leftBranch, rightBranch;
  
  public Branch(float angle, float len) {
    this.angle = angle;
    this.len = len;
    this.col = color(random(255), random(255), random(255));
  }
  
  public void branch(float len) {
    if (len > minBranchLength) {
      leftBranch = new Branch(angle, len);
      rightBranch = new Branch(-angle, len);
      leftBranch.render();
      rightBranch.render();
    }
  }
  
  public void render() {
    pushMatrix();
    stroke(col);
    line(0, 0, 0, -len);
    translate(0, -len);
    rotate(radians(angle));
    popMatrix();
  }
}
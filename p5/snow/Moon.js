function Moon(x, y) {
  this.x = x;
  this.y = y;
  
  this.update = function() {
    
  };
  
  this.render = function() {
    push();
    noStroke();
    translate(this.x, this.y);
    fill(255);
    ellipse(0, 0, 120, 120);
    fill(0,30,80);
    ellipse(40, 0, 120, 120);
    pop();
  };
}
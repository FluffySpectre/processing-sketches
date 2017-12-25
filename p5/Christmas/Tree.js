function Tree(x, y) {
  this.x = x;
  this.y = y;
  this.haloOffset = 10;
  this.angle = 0;
  
  this.run = function() {
    this.update();
    this.render();
  };
  
  this.update = function() {
    this.haloOffset = map(sin(this.angle), -1, 1, -5, 5);
    this.angle += 0.2;
  };
  
  this.render = function() {
    push();
    translate(this.x, this.y);
    noStroke();
    // tree
    //fill(0, 205, 50);
    fill(121,200,121);
    triangle(-100, 300, 0, 0, 100, 300);
    
    // shadow
    fill(21, 21, 21, 30);
    ellipse(0, 360, 200, 40);
    
    // stump
    fill(137, 100, 90);
    rect(-25, 300, 50, 60);  
    
    // star halo
    fill(255, 255, 0, 80);
    ellipse(0, 30, 90+this.haloOffset, 90+this.haloOffset);
    
    // star
    noStroke();
    //fill(255, 236, 23);
    fill(255, 255, 0);
    triangle(-25, 45, 0, 0, 25, 45);
    translate(0, 17);
    triangle(-25, 0, 0, 45, 25, 0);
    
    // balls
    fill(255, 0, 0);
    ellipse(10, 60, 10, 10);
    ellipse(-15, 90, 10, 10);
    ellipse(0, 140, 10, 10);
    ellipse(-40, 170, 10, 10);
    ellipse(50, 180, 10, 10);
    ellipse(10, 210, 10, 10);
    ellipse(-50, 230, 10, 10);
    ellipse(60, 240, 10, 10);
    ellipse(-5, 260, 10, 10);
    
    pop();
  };
}
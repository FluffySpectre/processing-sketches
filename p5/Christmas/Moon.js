function Moon(x, y) {
  this.x = x;
  this.y = y;
  this.eyePosX = 0;
  this.eyePosY = 6;
  this.eyeTargetX = 0;
  this.nextTargetChange = 0;
  
  this.update = function() {
    //this.eyePosX = map(mouseX, 0, width, -5, 5);
    //this.eyePosY = map(mouseY, 0, height, -5, 5);
    
    if (millis() > this.nextTargetChange) {
      this.eyeTargetX = floor(random(0, 10));
      
      this.nextTargetChange = millis() + random(2000, 5000);
    }
    
    if (this.eyePosX < this.eyeTargetX) {
      this.eyePosX += 0.5;
      if (this.eyePosX > 10) this.eyePosX = 10;
    } else if (this.eyePosX > this.eyeTargetX) {
      this.eyePosX -= 0.5;
      if (this.eyePosX < 0) this.eyePosX = 0;
    }
  };
  
  this.render = function() {
    push();
    noStroke();
    translate(this.x, this.y);
    fill(255);
    ellipse(0, 0, 130, 130);
    fill(0,30,80);
    ellipse(40, 0, 130, 130);
    
    // eye
    fill(50, 50, 50);
    translate(-44, -10);
    ellipse(0, 0, 30, 30);
    fill(255);
    ellipse(map(this.eyePosX, 0, 10, -6, 6), this.eyePosY, 12, 12);
    pop();
  };
}
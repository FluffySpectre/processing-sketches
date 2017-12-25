function SmallHouse(x, y) {
  this.x = x;
  this.y = y;
  this.w = 60;
  this.nextLightSwitch = millis() + random(6000, 20000);
  this.lightStates = [false, false];
  
  this.update = function() {
    if (millis() > this.nextLightSwitch) {
      for (var i=0; i<this.lightStates.length; i++) {
        this.lightStates[i] = floor(random(0, 2)) == 1;
      }
      this.nextLightSwitch = millis() + random(6000, 20000);
    }
  };
  
  this.render = function() {
    push();
    fill(60);
    noStroke();
    translate(this.x, this.y);
    rect(0, 0, this.w, 60);
    triangle(0, 0, this.w/2, -30, this.w, 0);
    
    fill(200, 200, 0);
    if (this.lightStates[0])
      rect(10, 10, 10, 10);
    if (this.lightStates[1])
      rect(this.w-20, 60-20, 10, 10);
    //if (this.numLightsOn > 2)
    //  rect(this.w-20, 10, 10, 10);
      
    pop();
  };
}
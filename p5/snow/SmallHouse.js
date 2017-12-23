function SmallHouse(x, y) {
  this.x = x;
  this.y = y;
  this.w = 60;
  this.maxLights = 2;
  this.numLightsOn = random(0, this.maxLights+1);
  this.nextLightSwitch = millis() + random(10000, 30000);
  
  this.update = function() {
    if (millis() > this.nextLightSwitch) {
      this.numLightsOn += floor(random(-1, 2));
      if (this.numLightsOn < 0) this.numLightsOn = 0;
      if (this.numLightsOn > this.maxLights) this.numLightsOn = this.maxLights;
      this.nextLightSwitch = millis() + random(10000, 30000);
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
    if (this.numLightsOn > 0)
      rect(10, 10, 10, 10);
    if (this.numLightsOn > 1)
      rect(this.w-20, 60-20, 10, 10);
    
    pop();
  };
}
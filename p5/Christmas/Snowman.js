function Snowman(x, y) {
  this.x = x;
  this.y = y;
  this.nextBlink = 0;
  this.blinking = 0;
  
  this.update = function() {
    if (millis() > this.nextBlink) {
      if (this.blinking == 2) {
        this.blinking = 0;
        this.nextBlink = millis() + random(500, 4000);
      } else {
        this.blinking++;
      }
    }
  };
  
  this.render = function() {
    var offsetHand = 30;
    strokeWeight(1);
    stroke(210);
    fill(250);
    
    // shadow
    push();
    noStroke();
    fill(21, 21, 21, 30);
    ellipse(this.x, this.y + 120, 100, 40);
    pop();
    
    ellipse(this.x,this.y+70,100,100);
    ellipse(this.x,this.y,80,80);
    
    push();
    translate(this.x,this.y-50);
    ellipse(0,0,60,60);
    // eyes
    if (this.blinking == 0) {
      fill(30);
      ellipse(-10, -10, 10, 10);
      ellipse(10, -10, 10, 10);
    }
    // nose
    fill(255,165,0);
    ellipse(0, 0, 5, 5);
    // mouth
    fill(30);
    ellipse(-10, 10, 5, 5);
    ellipse(-6, 14, 5, 5);
    ellipse(0, 14, 5, 5);
    ellipse(6, 14, 5, 5);
    ellipse(10, 10, 5, 5);
    pop();
    
    // hands
    push();
    stroke(193,126,42);
    strokeWeight(4);
    line(this.x-80,this.y-offsetHand,this.x-40,this.y - 15);
    line(this.x+80,this.y-offsetHand,this.x+40,this.y - 15);
    pop();
  };
}











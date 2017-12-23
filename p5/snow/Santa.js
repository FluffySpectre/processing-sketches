function Santa() {
  this.w = 360;
  this.h = 111;
  this.x = -this.w;
  this.y = 120;
  this.speed = 10;
  this.dir = 1;
  this.nextMove = millis() + random(20000, 60000);
  this.isMoving = false;
  this.sprite = loadImage('assets/santa.png');
  this.spriteLeft = loadImage('assets/santa_left.png');
  
  this.update = function() {
    if (!this.isMoving && millis() >= this.nextMove) {
      this.isMoving = true;
    }
    
    if (this.isMoving) {
      this.x += this.speed * this.dir;
      
      // right edge or left edge
      if ((this.dir == 1 && this.x > width + this.w) || 
          (this.dir == -1 && this.x < -this.w)) {
        this.dir *= -1;
        this.isMoving = false;
        this.nextMove = millis() + random(20000, 60000);
      } 
    }
  };
  
  this.render = function() {
    push();
    if (this.dir == 1) {
      image(this.sprite, this.x, this.y, this.w, this.h);
    } else {
      image(this.spriteLeft, this.x, this.y, this.w, this.h);
    }
    pop();
  };
}
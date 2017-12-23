function ShootingStar(x, y) {
  this.x = x;
  this.y = y;
  this.x2 = x;
  this.y2 = y;
  this.dirX = 1;
  this.dirY = 0.5;
  this.speed = 20;
  this.lifetime = 0.2;
  
  this.update = function() {
    this.lifetime -= 1/60;
      
    this.x2 += this.dirX * this.speed;
    this.y2 += this.dirY * this.speed;
  };
  
  this.render = function() {
    push();
    strokeWeight(2);
    line(this.x, this.y, this.x2, this.y2);
    pop();
  };
  
  this.isDead = function() {
    return this.lifetime <= 0;
  };
}
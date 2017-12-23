function ShootingStar(x, y) {
  this.x = x;
  this.y = y;
  this.x2 = x;
  this.y2 = y;
  this.dirX = 1;
  this.dirY = 0.5;
  this.speed = 10;
  this.lifetime = 10;
  this.particles = new ParticleSystem(createVector(this.x, this.y));
  
  this.update = function() {
    this.lifetime -= 1/30;
      
    this.x2 += this.dirX * this.speed;
    this.y2 += this.dirY * this.speed;
  };
  
  this.render = function() {
    push();
    
    this.particles.origin = createVector(this.x2, this.y2);
    this.particles.addParticle(new SparkleParticle(this.particles.origin));
    this.particles.run();
    
    noStroke();
    fill(255, 200, 0);
    //line(this.x, this.y, this.x2, this.y2);
    ellipse(this.x2, this.y2, 10, 10);
    pop();
  };
  
  this.isDead = function() {
    return this.lifetime <= 0;
  };
}
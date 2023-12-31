function Santa() {
  this.w = 360;
  this.h = 111;
  this.x = -this.w;
  this.y = 150;
  this.speed = 10;
  this.dir = 1;
  this.nextMove = millis() + random(8000, 20000);
  this.isMoving = false;
  this.sprite = loadImage('assets/santa.png');
  this.spriteLeft = loadImage('assets/santa_left.png');
  this.particles = new ParticleSystem(createVector(this.x, this.y));
  this.losePresentParticles = new ParticleSystem(createVector(this.x, this.y));
  this.nextLoss = millis() + random(1000, 3000);
  this.noseOn = false;
  
  this.run = function() {
    this.update();
    this.render();
  };
  
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
        this.nextMove = millis() + random(8000, 20000);
      } 
      
      if (frameCount%10 == 0) {
        this.noseOn = !this.noseOn;
      }
    }
  };
  
  this.render = function() {
    push();
    
    // animate particles
    if (this.dir == 1) this.particles.origin = createVector(this.x+this.w-20, this.y+this.h-15);
    else if (this.dir == -1) this.particles.origin = createVector(this.x+20, this.y+this.h-15);
    if (this.isMoving)
      this.particles.addParticle(new SparkleParticle(this.particles.origin));
    this.particles.run();
    
    // lose presents
    if (millis() > this.nextLoss) {
      if (this.dir == 1) this.losePresentParticles.origin = createVector(this.x, this.y);
      else if (this.dir == -1) this.losePresentParticles.origin = createVector(this.x+this.w, this.y);
      if (this.isMoving)
        this.losePresentParticles.addParticle(new PresentParticle(this.losePresentParticles.origin));
      this.nextLoss = millis() + random(1000, 3000);
    }
    this.losePresentParticles.run();
    
    if (this.dir == 1) {
      image(this.sprite, this.x, this.y, this.w, this.h);
      
      fill(255, 0, 0);
      noStroke();
      if (this.noseOn)
        ellipse(this.x+this.w-15, this.y+67, 10, 10);
    } else {
      image(this.spriteLeft, this.x, this.y, this.w, this.h);
      fill(255, 0, 0);
      noStroke();
      if (this.noseOn)
        ellipse(this.x+15, this.y+67, 10, 10);
    }
    
    pop();
  };
}
function PresentParticle(origin) {
  Particle.call(this, origin);
  
  this.theta = 0.0;
  this.lifespan = 310.0;
};

PresentParticle.prototype = Object.create(Particle.prototype);
PresentParticle.prototype.constructor = PresentParticle;

PresentParticle.prototype.update = function() {
  Particle.prototype.update.call(this);
  
  this.theta += (this.velocity.x * this.velocity.mag()) / 30.0;
}

PresentParticle.prototype.render = function() {
  push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  fill(255, this.lifespan);
  noStroke();
  rect(-10, -10, 20, 20);
  stroke(255, 0, 0, this.lifespan);
  strokeWeight(2);
  line(-10,0,10,0);
  line(0,-10,0,10);
  pop();
}
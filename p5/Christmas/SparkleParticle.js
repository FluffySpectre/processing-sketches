function SparkleParticle(origin) {
  Particle.call(this, origin);
  
  this.theta = 0.0;
};

SparkleParticle.prototype = Object.create(Particle.prototype);
SparkleParticle.prototype.constructor = SparkleParticle;

SparkleParticle.prototype.update = function() {
  Particle.prototype.update.call(this);
  
  this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
}

SparkleParticle.prototype.render = function() {
  push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  stroke(255, 200, 0, this.lifespan);
  line(-3,0,3,0);
  line(0,-3,0,3);
  pop();
}
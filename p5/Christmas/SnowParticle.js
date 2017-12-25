function SnowParticle(origin) {
  Particle.call(this, origin);
  
  this.size = round(random(minFlakeSize, maxFlakeSize));
  this.direction = round(random(0, 1));
};

SnowParticle.prototype = Object.create(Particle.prototype);
SnowParticle.prototype.constructor = SnowParticle;

SnowParticle.prototype.update = function() {
  if (this.direction == 0) {
    this.position.add(map(this.size, minFlakeSize, maxFlakeSize, 0.1, 0.5), 0);
  } else {
    this.position.sub(map(this.size, minFlakeSize, maxFlakeSize, 0.1, 0.5), 0);
  }
  
  this.position.add(0, (this.size + this.direction) * snowSpeed);
};

SnowParticle.prototype.render = function() {
  push();
  translate(this.position.x, this.position.y);
  fill(snowColor);
  ellipse(0, 0, this.size, this.size);
  pop();
};

SnowParticle.prototype.isDead = function() {
  if (this.position.x > width + this.size || this.position.x < -this.size || this.position.y > height + this.size) {
    return true;
  }
  return false;
};


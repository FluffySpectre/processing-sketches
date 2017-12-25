function SnowParticle(origin, texture) {
  Particle.call(this, origin);
  
  this.size = round(random(minFlakeSize, maxFlakeSize));
  this.direction = round(random(0, 1));
  this.texture = texture;
  this.rotationDir = (random(1) > 0.5) ? 1 : -1;
  this.angle = 0;
  this.rotationSpeed = random(0.1);
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
  
  this.angle += this.rotationSpeed * this.rotationDir;
};

SnowParticle.prototype.render = function() {
  push();
  translate(this.position.x, this.position.y);
  //fill(snowColor);
  //ellipse(0, 0, this.size, this.size);
  rotate(this.angle);
  imageMode(CENTER);
  image(this.texture, 0, 0, this.size, this.size);
  pop();
};

SnowParticle.prototype.isDead = function() {
  if (this.position.x > width + this.size || this.position.x < -this.size || this.position.y > height + this.size) {
    return true;
  }
  return false;
};

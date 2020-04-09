class Bug extends SimObject {
  constructor(position, rotation, scale) {
    super(position, rotation, scale);

    this.speed = 1.1;
    this.vitality = 100;
    this.maxVitality = 100;
  }
  
  update(deltaTime) {
    this.rotation.rotate(radians(random(-10, 10)));
    this.move();
  } 
  
  render() {
    push();
    translate(this.position.x+this.scale.x/2, this.position.y+this.scale.y/2);
    rotate(this.rotation.heading());
    fill(0, 0, 230);
    rect(-this.scale.x/2, -this.scale.y/2, this.scale.x, this.scale.y);
    pop();
  }

  move() {
    let vitalityFactor = 0.1 + this.vitality / this.maxVitality;
    this.position.x += this.rotation.x * this.speed * vitalityFactor;
    this.position.y += this.rotation.y * this.speed * vitalityFactor;
  }
}

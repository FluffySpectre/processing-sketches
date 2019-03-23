class Marker extends SimObject {
    constructor(position, rotation, scale, radius, direction) {
        super(position, rotation, scale);

        this.maxRadius = radius;
        this.direction = direction;
        
        // calculate spreadspeed
        this.spreadSpeed = radius / 4;

        this.radius = 0;
        this.isDead = false;
    }

    update(deltaTime) {
        if (this.isDead) return;
    
        this.radius += this.spreadSpeed * deltaTime;
        if (this.radius > this.maxRadius)
            this.isDead = true;
    }

    render() {
        if (this.isDead) return;
        
        noStroke();
        fill(240, 240, 10, map(this.radius, 0, this.maxRadius, 128, 0));
        ellipse(this.position.x, this.position.y, this.radius*2, this.radius*2);
        
        if (displayMarkerDirections) {
          // draw an arrow in the direction this marker is pointing
          const dir = p5.Vector.add(this.position, this.direction);
          this.arrow(this.position.x, this.position.y, dir.x, dir.y, map(this.radius, 0, this.maxRadius, 255, 0));
        }
    }

    arrow(x1, y1, x2, y2, alpha) {
        push();
        stroke(120, 120, 120, alpha);
        translate(x2, y2);
        const a = atan2(x1-x2, y2-y1);
        rotate(a);
        line(0, 0, -5, -5);
        line(0, 0, 5, -5);
        pop();
    }
}
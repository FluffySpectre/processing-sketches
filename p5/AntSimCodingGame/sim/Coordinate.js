class Coordinate {
    constructor(x, y, radius) {
        this.radius = radius;
        this.direction = 0;
        this.position = createVector(x, y);
    }

    setDirection(angle) {
      this.direction = angle;
      while (this.direction < 0)
        this.direction += 360;
      while (this.direction > 359)
        this.direction -= 360;
    }

    static distance(c1, c2) {
      let dist = c1.position.dist(c2.position) - c1.radius - c2.radius;
      dist = Math.floor(dist);
      if (dist < 0)
        return 0;
      return dist;
    }

    static distanceMidPoints(c1, c2) {
      let dist = c1.position.dist(c2.position);
      dist = Math.floor(dist);
      return dist;
    }

    static directionAngle(c1, c2) {
      let num = p5.Vector.sub(c2.position, c1.position).heading();
      //let num = Math.floor(Math.round(atan2((c2.position.y - c1.position.y), (c2.position.x - c1.position.x)) * 180.0 / Math.PI));
      if (num < 0)
        num += 360;
      return num;
    }

    static clampAngle(angle) {
      while (angle > 180)
          angle -= 360;
      while (angle < -180)
          angle += 360;
      return angle;
  }
}
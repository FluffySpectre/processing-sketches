class Coordinate {
    constructor(x, y, radius) {
        this.radius = radius;
        this.direction = 0;
        this.position = createVector(x, y);
    }

    static withDeltas(c, deltaX, deltaY) {
        let result = new Coordinate(0, 0, c.radius);
        result.position.x = c.position.x + deltaX;
        result.position.y = c.position.y + deltaY;
        result.direction = c.direction;
        return result;
    }

    get direction() {
        return this.directionVal;
    }

    set direction(value) {
        this.directionVal = value;
        while (this.directionVal < 0)
            this.directionVal += 360;
        while (this.directionVal > 359)
            this.directionVal -= 360;
        this.directionVal = Math.floor(this.directionVal);
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
        if (num < 0)
            num += 360;
        return Math.floor(num);
    }

    static clampAngle(angle) {
        while (angle > 180)
            angle -= 360;
        while (angle < -180)
            angle += 360;
        return angle;
    }
}
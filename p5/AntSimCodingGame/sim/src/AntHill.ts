/// <reference path="Coordinate.ts"/>

class AntHill extends Coordinate {
    constructor(x: number, y: number, radius: number) {
        super(x, y, radius);
    }

    render() {
        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(this.position.x, this.position.y, this.radius*2, this.radius*2);
    }
}

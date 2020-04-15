class AntHill {
    coordinate: Coordinate;

    constructor(x: number, y: number, radius: number) {
        this.coordinate = new Coordinate(x, y, radius);
    }

    render() {
        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius*2, this.coordinate.radius*2);
    }
}

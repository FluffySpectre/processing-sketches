class Marker {
    information: number;
    coordinate: Coordinate;
    private age: number = 0;
    private maxAge: number;
    private spread: number;

    constructor(coordinate: Coordinate, spread: number) {
        this.coordinate = coordinate;
        this.maxAge = SimSettings.markerMaximumAge;
        if (spread < 0) {
            spread = 0;
        }
        else {
            if (spread > SimSettings.markerRangeMaximum)
                spread = SimSettings.markerRangeMaximum;
            this.maxAge = this.maxAge * SimSettings.markerSizeMinimum / (SimSettings.markerSizeMinimum + spread);
        }
        this.spread = spread;
        this.update();
    }

    get isActive() {
        return this.age < this.maxAge;
    }

    update() {
        this.age++;
        this.coordinate.radius = SimSettings.markerSizeMinimum;
        this.coordinate.radius += this.spread * this.age / this.maxAge;
    }
    
    render() {
        noStroke();
        fill(240, 240, 10, map(this.age, 0, this.maxAge, 128, 0));
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius*2);
    }
}
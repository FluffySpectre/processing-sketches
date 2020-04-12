class Sugar extends Food {
    constructor(x, y, amount) {
        super(x, y, amount);
    }

    render() {
        stroke(100);
        fill(250);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius*2);
    }
}
class Sugar extends Food {
    constructor(x: number, y: number, amount: number) {
        super(x, y, amount);
    }

    render() {
        stroke(100);
        fill(250);
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }
}
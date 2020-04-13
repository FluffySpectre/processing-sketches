class Sugar extends Food {
    constructor(x, y, amount) {
        super(x, y, amount);
    }

    render() {
        stroke(100);
        fill(250);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius * 2);

        if (SimSettings.displayDebugLabels) {
            fill(20);
            textSize(14);
            let tw = textWidth(this.amount);
            text(this.amount, this.coordinate.position.x - tw / 2, this.coordinate.position.y - 16);
        }
    }
}
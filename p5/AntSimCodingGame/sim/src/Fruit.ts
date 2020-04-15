class Fruit extends Food {
    carriers: Insect[];

    constructor(x: number, y: number, amount: number) {
        super(x, y, amount);

        this.carriers = [];
    }

    get amount() {
        return this.amountVal;
    }

    set amount(val) {
        this.amountVal = val;
        this.coordinate.radius = Math.floor((SimSettings.fruitRadiusMultiplier * Math.sqrt(this.amount / Math.PI)));
    }

    needsCarriers(colony: Colony) {
        let num = 0;
        for (let a of this.carriers) {
            if (a.colony === colony)
                num += a.currentLoad;
        }
        return num * SimSettings.fruitLoadMultiplier < this.amount;
    }

    render() {
        stroke(100);
        fill(10, 230, 10);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius * 2);

        if (SimSettings.displayDebugLabels && this.carriers.length > 0) {
            fill(20);
            textSize(16);
            let tw = textWidth(this.carriers.length.toString());
            text(this.carriers.length.toString(), this.coordinate.position.x - tw / 2, this.coordinate.position.y - 16);
        }
    }
}
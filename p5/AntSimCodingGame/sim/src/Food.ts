class Food {
    coordinate: Coordinate;

    constructor(x: number, y: number, amount: number) {
        this.coordinate = new Coordinate(x, y, 0);
        this.amount = amount;
    }

    amountVal: number;
    get amount() {
        return this.amountVal;
    }
    set amount(val) {
        this.amountVal = val;
        this.coordinate.radius = Math.floor(Math.round(Math.sqrt(this.amount / Math.PI) * SimSettings.sugarRadiusMultiplier));
    }
}
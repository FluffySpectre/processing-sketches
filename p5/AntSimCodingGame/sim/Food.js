class Food {
    constructor(x, y, amount) {
        this.coordinate = new Coordinate(x, y, 0);
        this.amount = amount;
    }

    get amount() {
        return this.amountVal;
    }
    
    set amount(val) {
        this.amountVal = val;
        this.coordinate.radius = Math.floor(Math.round(Math.sqrt(this.amount / Math.PI) * 0.5));
    }
}
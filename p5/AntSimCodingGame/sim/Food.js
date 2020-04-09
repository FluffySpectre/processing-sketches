class Food extends SimObject {
    constructor(position, rotation, scale, amount) {
        super(position, rotation, scale);

        this.amount = amount;
        this.maxAmount = amount;
    }
}
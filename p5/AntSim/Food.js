class Food extends SimObject {
    constructor(position, rotation, scale, amount) {
        super(position, rotation, scale);

        this.amount = amount;
        this.maxAmount = amount;
    }

    pickup(amount) {
        const pickAmount = Math.min(amount, this.amount);
        this.amount -= pickAmount;
        return pickAmount;
    }
    
    render() {
        stroke(100);
        fill(250);
        ellipse(this.position.x, this.position.y, this.scale.x * (this.amount / this.maxAmount), this.scale.y * (this.amount / this.maxAmount));
    }
}
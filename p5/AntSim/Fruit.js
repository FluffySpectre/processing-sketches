class Fruit extends Food {
    constructor(position, rotation, scale, amount) {
        super(position, rotation, scale, amount);

        this.carriers = [];
        this.targetReachDist = 5;
        this.maxCarriers = 5;
    }

    pickup(ant) {
        this.carriers.push(ant);
        ant.canMove = false;
    }

    drop(ant) {
        if (this.carriers.indexOf(ant) > -1)
            this.carriers.remove(ant);
    }

    update(deltaTime) {
        if (this.carriers.length == 0) return;

        // calculate current position towards the anthill
        this.rotation = p5.Vector.sub(this.carriers[0].antHill.position, this.position).normalize();
        this.position.x += this.rotation.x * fruitBaseSpeed * this.carriers.length;
        this.position.y += this.rotation.y * fruitBaseSpeed * this.carriers.length;

        // set the current direction and velocity for all carriers too
        for (let ant of this.carriers) {
            ant.position = this.position.copy();
            ant.rotation = this.rotation.copy();
            ant.target = null;
        }

        if (p5.Vector.dist(this.position, this.carriers[0].antHill.position) < this.targetReachDist) {
            foodCollected += this.amount;
            this.amount = 0;

            for (let ant of this.carriers) {
                ant.drop();
            }

            this.carriers = [];
        }
    }

    render() {
        stroke(100);
        fill(10, 230, 10);
        ellipse(this.position.x, this.position.y, this.scale.x, this.scale.y);
    }
}
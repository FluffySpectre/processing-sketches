class CollectorAnt extends Ant {
    constructor(name, position, rotation, scale, speed, antHill) {
        super(name, position, rotation, scale, speed, antHill);
    }

    seesFood(food) {
        if (!this.target)
            this.target = food;
    }

    seesFruit(fruit) {
        if (!this.target)
            this.target = fruit;
    }

    smellsMarker(marker) {
        if (this.target == null) {
            //this.target = marker.direction;
        }
    }

    foodReached(food) {
        this.take(food);
        this.moveHome();
    }

    homeReached(target) {
        if (target instanceof AntHill) {
            foodCollected += this.carryFood;

            if (this.lastTarget != null)
                this.target = this.lastTarget;
            else
                this.target = null;

            this.speedModificator = 1;
            this.drop();
        }
    }
}
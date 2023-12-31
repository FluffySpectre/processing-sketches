class CollectorAnt extends BaseAnt {
    constructor(name, position, rotation, scale, speed, antHill) {
        super(name, position, rotation, scale, speed, antHill);
    }

    seesSugar(sugar) {
        if (this.carryFood === 0)
            this.target = sugar;
    }

    seesFruit(fruit) {
        if (this.carryFood === 0 && fruit.carriers.length < fruit.maxCarriers)
            this.target = fruit;
    }

    smellsMarker(marker) {
        if (this.carryFood === 0) {
            if (marker.target)
                this.target = marker.target;
            else 
                this.target = null;
        }
    }

    foodReached(food) {
        if (food) 
            this.take(food);
        else
            this.target = null;

        if (this.carryFood > 0)
            this.moveHome();
        else 
            this.target = null;
    }

    homeReached() {
        if (this.carryFood > 0) {
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
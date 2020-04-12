var COLONY_INFO = {
    name: 'Beispielameisen',
    creator: 'Björn Bosse'
};

class PlayerAnt extends BaseAnt {
    getCaste() {
        return random(1) < 0.8 ? 'collector' : 'warrior';
    }

    awakes() {
        if (this.caste === 'warrior') {
            this.col = color(255, 0, 0);
        } else {
            this.col = color(20);
        }
    }

    waits() {
        this.goForward(20);
    }

    spotsBug(bug) {
        if (this.caste === 'warrior') {
            this.goTo(bug);
        }
    }

    spotsSugar(sugar) {
        if (this.caste === 'warrior') return;

        if (this.carryFood === 0)
            this.target = sugar;
    }

    spotsFruit(fruit) {
        if (this.caste === 'warrior') return;

        if (this.carryFood === 0 && fruit.carriers.length < fruit.maxCarriers)
            this.target = fruit;
    }

    smellsMarker(marker) {
        if (this.caste === 'warrior') return;

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
            this.goHome();
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
var COLONY_INFO = {
    name: 'Beispielameisen',
    creator: 'Björn Bosse',
    castes: [
        { name: 'warrior', speedModificator: 1 }
    ]
};

class PlayerAnt extends BaseAnt {
    // EVENTS
    // awakes() {}
    waits() {
        this.turnByDegrees(random(-45, 45));
        this.goForward(50);
    }
    // spotsBug(bug) {}
    spotsSugar(sugar) {
        if (this.currentLoad > 0) return;

        this.goToTarget(sugar);
    }
    spotsFruit(fruit) {
        if (this.currentLoad > 0 || !this.needsCarriers(fruit)) return;

        this.goToTarget(fruit);
    }
    // smellsMarker(marker) {}
    sugarReached(sugar) {
        this.take(sugar);
        this.goHome();
    }
    fruitReached(fruit) {
        this.take(fruit);
        this.goHome();
    }
    becomesTired() {
        this.goHome();
    }
    // hasDied(death) {}
    // tick() {}

    // COMMANDS
    // goForward(distance)
    // goToTarget(target)
    // goAwayFromTarget(target)
    // goHome()
    // stop()
    // turnByDegrees(angle)
    // turnToTarget(target)
    // turnToDirection(direction)
    // turnAround()
    // think(message)
    // take(food)
    // drop()
    // needsCarriers(fruit)

    // STATE
    // direction
}
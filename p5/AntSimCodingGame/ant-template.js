var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Beispielameisen',
    castes: [
        { name: 'warrior', color: 'red', speed: 1, rotationSpeed: 0, load: -1, range: -1, viewRange: 0, vitality: -1, attack: 2 },
        { name: 'collector', color: '#222', speed: -1, rotationSpeed: 1, load: 2, range: 1, viewRange: -1, vitality: -1, attack: -1 }
    ]
};

class PlayerAnt extends BaseAnt {
    // CASTE SELECTION
    determineCaste(availableAnts) {
        if (availableAnts['warrior'] < 5)
            return 'warrior';
        else 
            return 'collector';
    }

    // EVENTS
    // awakes() {}
    waits() {
        this.turnByDegrees(random(-45, 45));
        this.goForward(50);
    }
    // spotsBug(bug) {}
    spotsSugar(sugar) {
        if (this.caste !== 'collector' || this.currentLoad > 0) return;

        this.goToTarget(sugar);
    }
    spotsFruit(fruit) {
        if (this.caste !== 'collector' || this.currentLoad > 0 || !this.needsCarriers(fruit)) return;

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
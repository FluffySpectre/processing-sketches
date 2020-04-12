var COLONY_INFO = {
    name: 'Beispielameisen',
    creator: 'Björn Bosse'
};

class PlayerAnt extends BaseAnt {
    // EVENTS
    // awakes() {}
    waits() {
        this.turnByDegrees(random(0, 360));
        this.goForward(50);
    }
    // spotsBug(bug) {}
    spotsSugar(sugar) {
        this.think('Mhhm, Zucker!');

        this.goToTarget(sugar);
    }
    spotsFruit(fruit) {
        this.think('Juhuu, ein Apfel!');
    }
    // smellsMarker(marker) {}
    // sugarReached(sugar) {}
    // fruitReached(fruit) {}
    becomesTired() {
        this.stop();
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
}
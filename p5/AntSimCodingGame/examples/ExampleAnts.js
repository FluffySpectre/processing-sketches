var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Beispielameisen',
    castes: [
        { name: 'soldier', color: 'red', speed: 1, rotationSpeed: 0, load: -1, range: -1, viewRange: 0, vitality: -1, attack: 2 },
        { name: 'collector', color: '#222', speed: -1, rotationSpeed: 1, load: 2, range: 1, viewRange: -1, vitality: -1, attack: -1 }
    ]
};

class PlayerAnt extends BaseAnt {
    determineCaste(availableInsects) {
        if (availableInsects['soldier'] < 5)
            return 'soldier';
        else 
            return 'collector';
    }

    waits() {
        this.turnByDegrees(random(-45, 45));
        this.goForward(50);
    }
    
    spotsSugar(sugar) {
        if (this.caste !== 'collector' || this.currentLoad > 0) return;

        this.goToTarget(sugar);
    }
    
    spotsFruit(fruit) {
        if (this.caste !== 'collector' || this.currentLoad > 0 || !this.needsCarriers(fruit)) return;

        this.goToTarget(fruit);
    }
    
    spotsBug(bug) {
        if (this.caste === 'collector') {
            this.drop();
            this.goAwayFromTarget(bug, 50);
        } else {
            this.goToTarget(bug);
        }
    }

    smellsFriend(marker) {
        if (this.target instanceof Sugar || this.target instanceof Fruit || this.target instanceof AntHill)
            return;
        this.turnToDirection(marker.information);
        this.goForward(this.viewRange * 2);
    }
    
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

    tick() {
        if (!this.target || this.currentLoad <= 0)
            return;
        this.setMarker(Coordinate.directionAngle(this.coordinate, this.target.coordinate) - 180, 25);
    }
}
var PLAYER_INFO = {
    name: 'Björn Bosse',
    colonyName: 'Beispielameisen',
    castes: [
        { name: 'warrior', color: 'red', speed: 1, rotationSpeed: 0, load: -1, range: -1, viewRange: 0, vitality: -1, attack: 2 },
        { name: 'collector', color: '#222', speed: -1, rotationSpeed: 1, load: 2, range: 1, viewRange: -1, vitality: -1, attack: -1 }
    ]
};

class PlayerAnt extends BaseAnt {
    determineCaste(availableInsects) {
        if (availableInsects['warrior'] < 5)
            return 'warrior';
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
        }
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
}
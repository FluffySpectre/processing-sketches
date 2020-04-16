var PLAYER_INFO = {
    name: '<Your Name>',
    colonyName: 'My first ants',
    castes: [
        { name: 'collector', color: 'black', speed: 0, rotationSpeed: 0, load: 2, range: 1, viewRange: -1, vitality: -1, attack: -1 }
    ]
};

class PlayerAnt extends BaseAnt {
    // this function gets called if the ant is created
    constructor() {
        super(); // needs to be called first

        // add here your custom variables
        //...
    }

    // CASTE SELECTION
    determineCaste(availableInsects) {
        return 'collector';
    }

    // EVENTS
    // waits() {}
    // spotsSugar(sugar) {}
    // spotsFruit(fruit) {}
    // spotsBug(bug) {}
    // spotsFriend(ant) {}
    // smellsFriend(marker) {}
    // sugarReached(sugar) {}
    // fruitReached(fruit) {}
    // becomesTired() {}
    // underAttack(bug) {}
    // hasDied(death) {}
    // tick() {}

    // COMMANDS
    // this.goForward(distance)
    // this.goToTarget(target)
    // this.goAwayFromTarget(target)
    // this.goHome()
    // this.stop()
    // this.turnByDegrees(angle)
    // this.turnToTarget(target)
    // this.turnToDirection(direction)
    // this.turnAround()
    // this.think(message)
    // this.take(food)
    // this.drop()
    // this.needsCarriers(fruit)
    // this.setMarker(information, spread)
    // this.attackTarget(insect)

    // CASTE-RELATED
    // this.maxVitality
    // this.maxLoad
    // this.maxSpeed
    // this.rotationSpeed
    // this.range
    // this.viewRange
    // this.attack

    // STATE
    // this.target
    // this.remainingDistance
    // this.remainingRotation
    // this.traveledDistance
    // this.direction
    // this.vitality
    // this.currentSpeed
    // this.currentLoad
    // this.carriedFruit
    // this.caste
    // this.target
    // this.isTired
    // this.distanceToAntHill
    // this.antsInViewRange
    // this.antsFromSameCasteInViewRange
    // this.bugsInViewRange
}
var PLAYER_INFO = {
    name: '<Your Name>',
    colonyName: 'My first ants',
    castes: [
        { name: 'default', color: 'black', speed: 0, rotationSpeed: 0, load: 0, range: 0, viewRange: 0, vitality: 0, attack: 0 }
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
        return 'default';
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

    // UTLITIES
    // Coordinate.distance(coordinate1, coordinate2)
    // Coordinate.directionAngle(coordinate1, coordinate2)
}
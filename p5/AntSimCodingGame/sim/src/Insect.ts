class Insect {
    colony: Colony;
    casteIndex: number;
    remainingDistance: number;
    remainingRotation: number;
    reached: boolean;
    traveledDistance: number;
    coordinate: Coordinate;
    currentSpeed: number;
    carriedFruit: Fruit;
    debugMessage: string;
    smelledMarker: Marker[];
    colour: string;
    colonyCount: number;
    casteCount: number;
    bugCount: number;

    constructor() { }

    init(colony: Colony, availableInsects: {[key: string]: number}) {
        this.colony = colony;
        this.colour = '#222';

        this.casteIndex = 0;
        this.remainingDistance = 0;
        this.remainingRotation = 0;
        this.target = null;
        this.reached = false;
        this.traveledDistance = 0;
        this.vitality = this.maxVitality;
        this.currentSpeed = this.colony.castesSpeed[this.casteIndex];
        this.carriedFruit = null;
        this.currentLoad = 0;
        this.debugMessage = null;
        this.smelledMarker = [];
        this.colonyCount = 0;
        this.casteCount = 0;

        // if we got an anthill spawn there, otheriwise at a random position on the map
        if (this.colony.antHill)
            this.coordinate = new Coordinate(this.colony.antHill.coordinate.position.x, this.colony.antHill.coordinate.position.y, 5);
        else
            this.coordinate = new Coordinate(random(0, width), random(0, height), 5);

        this.coordinate.direction = random(0, 359);
    }

    // getter/setter
    get target() {
        return this.targetVal;
    }
    set target(value) {
        if (this.target === value && value !== null)
            return;
        this.targetVal = value;

        // TODO: find out why these two lines break the target movement
        // this.remainingRotation = 0;
        // this.remainingDistance = 0;
    }
    private targetVal: any;

    get currentLoad() {
        return this.currentLoadVal;
    }
    set currentLoad(value) {
        value = Math.floor(value);
        this.currentLoadVal = value >= 0 ? value : 0;
        this.currentSpeed = this.colony.castesSpeed[this.casteIndex];
        this.currentSpeed -= Math.floor(this.currentSpeed * this.currentLoad / this.colony.castesLoad[this.casteIndex] / 2);
    }
    private currentLoadVal: number;

    get maxLoad() {
        return this.colony.castesLoad[this.casteIndex];
    }

    get vitality() {
        return this.vitalityVal;
    }
    set vitality(value) {
        value = Math.floor(value);
        this.vitalityVal = value >= 0 ? value : 0;
    }
    private vitalityVal: number;

    get maxSpeed() {
        return this.colony.castesSpeed[this.casteIndex];
    }

    get rotationSpeed() {
        return this.colony.castesRotationSpeed[this.casteIndex];
    }

    get range() {
        return this.colony.castesRange[this.casteIndex];
    }

    get viewRange()  {
        return this.colony.castesViewRange[this.casteIndex];
    }

    get maxVitality() {
        return this.colony.castesVitality[this.casteIndex];
    }

    get attack() {
        if (this.currentLoad !== 0) return 0;
        return this.attackVal;
    }
    set attack(value) {
        value = Math.floor(value);
        this.attackVal = value >= 0 ? value : 0;
    }
    private attackVal: number;

    get direction() {
        return this.coordinate.direction;
    }

    get caste() {
        return this.colony.castes[this.casteIndex].name;
    }

    get distanceToAntHill() {
        let d = Number.MAX_SAFE_INTEGER;
        if (this.colony.antHill) {
            let d2 = Coordinate.distanceMidPoints(this.coordinate, this.colony.antHill.coordinate);
            if (d2 < d) {
                d = d2;
            }
        }
        return d;
    }

    get antsInViewRange() {
        return this.colonyCount;
    }

    get antsFromSameCasteInViewRange() {
        return this.casteCount;
    }

    get bugsInViewRange() {
        return this.bugCount;
    }

    // sim functions
    move() {
        if (this.remainingRotation !== 0) {
            if (Math.abs(this.remainingRotation) < this.rotationSpeed) {
                this.coordinate.direction += this.remainingRotation;
                this.remainingRotation = 0;
            }
            else if (this.remainingRotation >= this.rotationSpeed) {
                this.coordinate.direction += this.rotationSpeed;
                this.remainingRotation = Coordinate.clampAngle(this.remainingRotation - this.rotationSpeed);
            }
            else if (this.remainingRotation <= -this.rotationSpeed) {
                this.coordinate.direction -= this.rotationSpeed;
                this.remainingRotation = Coordinate.clampAngle(this.remainingRotation + this.rotationSpeed);
            }
        }
        else if (this.remainingDistance > 0) {
            if (!this.carriedFruit) {
                let steps = Math.min(this.remainingDistance, this.currentSpeed);
                this.remainingDistance -= steps;
                this.traveledDistance += steps;

                this.coordinate.position.x += steps * Math.cos(this.coordinate.direction * Math.PI / 180.0);
                this.coordinate.position.y += steps * Math.sin(this.coordinate.direction * Math.PI / 180.0);
            }
        }
        else if (this.target !== null) {
            let d = Coordinate.distanceMidPoints(this.coordinate, this.target.coordinate);
            this.reached = d <= 5;
            if (!this.reached) {
                let dir = Coordinate.directionAngle(this.coordinate, this.target.coordinate);
                if (d < this.viewRange || this.carriedFruit) {
                    this.remainingDistance = d;
                }
                else {
                    dir += random(-10, 10);
                    this.remainingDistance = this.viewRange;
                }
                this.turnToDirection(dir);
            }
        }

        if (this.coordinate.position.x < 0) {
            this.coordinate.position.x = -this.coordinate.position.x;
            if (this.coordinate.direction > 90 && this.coordinate.direction <= 180)
                this.coordinate.direction = 180 - this.coordinate.direction;
            else if (this.coordinate.direction > 180 && this.coordinate.direction < 270)
                this.coordinate.direction = 540 - this.coordinate.direction;
        }
        else if (this.coordinate.position.x > width) {
            this.coordinate.position.x = width - this.coordinate.position.x;
            if (this.coordinate.direction >= 0 && this.coordinate.direction < 90)
                this.coordinate.direction = 180 - this.coordinate.direction;
            else if (this.coordinate.direction > 270 && this.coordinate.direction < 360)
                this.coordinate.direction = 540 - this.coordinate.direction;
        }
        if (this.coordinate.position.y < 0) {
            this.coordinate.position.y = -this.coordinate.position.y;
            // if (this.coordinate.direction <= 180 || this.coordinate.direction >= 360)
            //     return;
            this.coordinate.direction = 360 - this.coordinate.direction;
        }
        else {
            if (this.coordinate.position.y <= height)
                return;
            this.coordinate.position.y = height - this.coordinate.position.y;
            if (this.coordinate.direction <= 0 || this.coordinate.direction >= 180)
                return;
            this.coordinate.direction = 360 - this.coordinate.direction;
        }
    }

    // rendering
    render() {}

    // player commands
    // moving
    goForward(distance: number) {
        if (!distance || Number(distance) === NaN) distance = Number.MAX_SAFE_INTEGER;
        this.remainingDistance = distance;
    }
    goToTarget(target: any) {
        this.target = target;
    }
    goAwayFromTarget(target: any, distance: number) {
        this.turnToDirection(Coordinate.directionAngle(this.coordinate, target.coordinate) + 180);
        this.goForward(distance);
    }
    goHome() {
        this.goToTarget(this.colony.antHill);
    }
    stop() {
        this.target = null;
        this.remainingDistance = 0;
        this.remainingRotation = 0;
    }
    // turning
    turnByDegrees(angle: number) {
        this.remainingRotation = Coordinate.clampAngle(angle);
    }
    turnToTarget(target: any) {
        if (!target || !target.coordinate) return;
        this.remainingRotation = Coordinate.clampAngle(Coordinate.directionAngle(this.coordinate, target.coordinate) - this.coordinate.direction);
    }
    turnToDirection(direction: number) {
        this.remainingRotation = Coordinate.clampAngle(direction - this.coordinate.direction);
    }
    turnAround() {
        if (this.remainingRotation > 0) this.remainingRotation = 180;
        else this.remainingRotation = -180;
    }
    // food
    take(food: Food) {
        if (food instanceof Sugar) {
            if (Coordinate.distanceMidPoints(this.coordinate, food.coordinate) <= 5) {
                let num = Math.min(this.maxLoad - this.currentLoad, food.amount);
                this.currentLoad += num;
                food.amount -= num;
            }
        } else if (food instanceof Fruit) {
            if (this.carriedFruit === food)
                return;
            if (this.carriedFruit)
                this.drop();
            if (Coordinate.distanceMidPoints(this.coordinate, food.coordinate) > 5)
                return;
            this.stop();
            this.carriedFruit = food;
            food.carriers.push(this);
            this.currentLoad = this.maxLoad;
        }
    }
    drop() {
        this.currentLoad = 0;
        this.target = null;
        if (!this.carriedFruit)
            return;
        let ci = this.carriedFruit.carriers.indexOf(this);
        if (ci > -1)
            this.carriedFruit.carriers.splice(ci, 1);
        this.carriedFruit = null;
    }
    needsCarriers(fruit: Fruit) {
        return fruit.needsCarriers(this.colony);
    }
    // fighting
    attackTarget(insect: Insect) {
        this.target = insect;
    }
    // marker
    setMarker(information: number, spread: number) {
        if (!spread || Number(spread) === NaN || spread < 0)
            spread = 0;
        let m = new Marker(this.coordinate.copy(), spread);
        m.information = information;
        this.colony.newMarker.push(m);
        this.smelledMarker.push(m);
    }
    //debug
    think(message: string) {
        if (message)
            this.debugMessage = message.length > 100 ? message.substr(0, 100) : message;
        else 
            this.debugMessage = null;
    }
}
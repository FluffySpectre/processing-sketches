class AntColony {
    constructor(x, y, playerInfo) {
        this.antDelay = 0;
        this.coordinate = new Coordinate(x, y, 25);
        this.ants = [];
        this.starvedAnts = [];
        this.antDelay = 0;
        this.statistics = new PlayerStatistics();
        this.playerInfo = playerInfo;
        this.antRange = 1800;
        this.antBaseSpeed = 1;
        this.antMaxLoad = 5;
        this.castes = playerInfo.castes;
        this.antsInCaste = this.castes.map(c => 0);
    }
    newAnt() {
        let availableAnts = null;
        if (this.castes && this.castes.length > 0) {
            availableAnts = {};
            let castesCount = 0;
            for (let caste of this.castes) {
                if (!availableAnts.hasOwnProperty(caste.name)) {
                    availableAnts[caste.name] = this.antsInCaste[castesCount];
                }
                castesCount++;
            }
        }
        let ant = new PlayerAnt();
        ant.init(this, availableAnts);
        this.ants.push(ant);
        this.antsInCaste[ant.casteIndex]++;
        ant.awakes();
    }
    removeAnt(ant) {
        let ai = this.ants.indexOf(ant);
        if (ai > -1)
            this.ants.splice(ai, 1);
    }
    render() {
        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius * 2, this.coordinate.radius * 2);
    }
}
let environment;
let playerCodeAvailable = false;
function playerCodeLoaded() {
    environment = new Environment(PLAYER_INFO, 0);
    playerCodeAvailable = true;
}
function setup() {
    var cnv = createCanvas(windowWidth, windowWidth);
    cnv.style('display', 'block');
}
function windowResized() {
    resizeCanvas(windowWidth, windowWidth);
}
function draw() {
    angleMode(DEGREES);
    background(245, 222, 179);
    if (!playerCodeAvailable)
        return;
    if (environment.currentRound < SimSettings.totalRounds) {
        environment.step();
    }
    else {
    }
    environment.render();
    fill(20);
    text('Round: ' + environment.currentRound, 10, 20);
    text('Points: ' + environment.colony.statistics.points, 10, 36);
}
class BaseAnt {
    constructor() { }
    init(colony, availableAnts) {
        this.colony = colony;
        let cIndex = -1;
        if (availableAnts) {
            let antCast = this.determineCast(availableAnts);
            for (let i = 0; i < colony.castes.length; i++) {
                let cast = this.colony.castes[i];
                if (cast.name == antCast) {
                    cIndex = i;
                    break;
                }
            }
        }
        if (cIndex > -1) {
            this.casteIndex = cIndex;
            console.log('Cast set to: ' + colony.castes[this.casteIndex].name);
        }
        else {
            console.error('Caste not exists!');
        }
        this.remainingDistance = 0;
        this.remainingRotation = 0;
        this.target = null;
        this.reached = false;
        this.traveledDistance = 0;
        this.vitality = 50;
        this.maxVitality = 50;
        this.coordinate = new Coordinate(colony.coordinate.position.x, colony.coordinate.position.y, 5);
        this.rotationSpeed = 10;
        this.currentSpeed = this.colony.antBaseSpeed;
        this.viewDistance = 20;
        this.carriedFruit = null;
        this.currentLoad = 0;
        this.debugMessage = null;
        this.isTired = false;
        this.smelledMarker = [];
        this.w = 6;
        this.h = 3;
    }
    get target() {
        return this.targetVal;
    }
    set target(value) {
        if (this.target === value && value !== null)
            return;
        this.targetVal = value;
    }
    get currentLoad() {
        return this.currentLoadVal;
    }
    set currentLoad(value) {
        this.currentLoadVal = value >= 0 ? value : 0;
        this.currentSpeed = this.colony.antBaseSpeed;
        this.currentSpeed -= this.currentSpeed * this.currentLoad / this.colony.antMaxLoad / 2;
    }
    get direction() {
        return this.coordinate.direction;
    }
    get caste() {
        return this.colony.castes[this.casteIndex].name;
    }
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
                if (d < this.viewDistance || this.carriedFruit) {
                    this.remainingDistance = d;
                }
                else {
                    dir += random(-10, 10);
                    this.remainingDistance = this.viewDistance;
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
    render() {
        push();
        translate(this.coordinate.position.x, this.coordinate.position.y);
        if (this.debugMessage) {
            fill(20);
            textSize(16);
            let tw = textWidth(this.debugMessage);
            text(this.debugMessage, -tw / 2, -16);
        }
        rotate(this.coordinate.direction);
        noStroke();
        fill(20);
        rect(-this.w / 2, -this.h / 2, this.w, this.h);
        if (this.currentLoad > 0 && !this.carriedFruit) {
            fill(250);
            rect(-2.5, -2.5, 5, 5);
        }
        pop();
    }
    determineCast(availableAnts) { }
    awakes() { }
    waits() { }
    spotsSugar(sugar) { }
    spotsFruit(fruit) { }
    sugarReached(sugar) { }
    fruitReached(fruit) { }
    becomesTired() { }
    hasDied(death) { }
    tick() { }
    goForward(distance) {
        if (!distance || Number(distance) === NaN)
            distance = Number.MAX_SAFE_INTEGER;
        this.remainingDistance = distance;
    }
    goToTarget(target) {
        this.target = target;
    }
    goAwayFromTarget(target, distance) {
        this.turnToDirection(Coordinate.directionAngle(this.coordinate, target.coordinate) + 180);
        this.goForward(distance);
    }
    goHome() {
        this.goToTarget(this.colony);
    }
    stop() {
        this.target = null;
        this.remainingDistance = 0;
        this.remainingRotation = 0;
    }
    turnByDegrees(angle) {
        this.remainingRotation = Coordinate.clampAngle(angle);
    }
    turnToTarget(target) {
        if (!target || !target.coordinate)
            return;
        this.remainingRotation = Coordinate.clampAngle(Coordinate.directionAngle(this.coordinate, target.coordinate) - this.coordinate.direction);
    }
    turnToDirection(direction) {
        this.remainingRotation = Coordinate.clampAngle(direction - this.coordinate.direction);
    }
    turnAround() {
        if (this.remainingRotation > 0)
            this.remainingRotation = 180;
        else
            this.remainingRotation = -180;
    }
    take(food) {
        if (food instanceof Sugar) {
            if (Coordinate.distanceMidPoints(this.coordinate, food.coordinate) <= 5) {
                let num = Math.min(this.colony.antMaxLoad - this.currentLoad, food.amount);
                this.currentLoad += num;
                food.amount -= num;
            }
        }
        else if (food instanceof Fruit) {
            if (this.carriedFruit === food)
                return;
            if (this.carriedFruit)
                this.drop();
            if (Coordinate.distanceMidPoints(this.coordinate, food.coordinate) > 5)
                return;
            this.stop();
            this.carriedFruit = food;
            food.carriers.push(this);
            this.currentLoad = this.colony.antMaxLoad;
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
    needsCarriers(fruit) {
        return fruit.needsCarriers(this.colony);
    }
    think(message) {
        this.debugMessage = message.length > 100 ? message.substr(0, 100) : message;
    }
}
class Bug {
    constructor(x, y) {
        this.coordinate = new Coordinate(x, y, 10);
    }
}
class Coordinate {
    constructor(x, y, radius) {
        this.radius = radius;
        this.direction = 0;
        this.position = createVector(x, y);
    }
    static withDeltas(c, deltaX, deltaY) {
        let result = new Coordinate(0, 0, c.radius);
        result.position.x = c.position.x + deltaX;
        result.position.y = c.position.y + deltaY;
        result.direction = c.direction;
        return result;
    }
    get direction() {
        return this.directionVal;
    }
    set direction(value) {
        this.directionVal = value;
        while (this.directionVal < 0)
            this.directionVal += 360;
        while (this.directionVal > 359)
            this.directionVal -= 360;
        this.directionVal = Math.floor(this.directionVal);
    }
    static distance(c1, c2) {
        let dist = c1.position.dist(c2.position) - c1.radius - c2.radius;
        dist = Math.floor(dist);
        if (dist < 0)
            return 0;
        return dist;
    }
    static distanceMidPoints(c1, c2) {
        let dist = c1.position.dist(c2.position);
        dist = Math.floor(dist);
        return dist;
    }
    static directionAngle(c1, c2) {
        let num = p5.Vector.sub(c2.position, c1.position).heading();
        if (num < 0)
            num += 360;
        return Math.floor(num);
    }
    static clampAngle(angle) {
        while (angle > 180)
            angle -= 360;
        while (angle < -180)
            angle += 360;
        return angle;
    }
}
class Environment {
    constructor(playerInfo, randSeed) {
        if (randSeed !== 0)
            randomSeed(randSeed);
        this.sugarHills = [];
        this.fruits = [];
        this.colony = new AntColony(width / 2, height / 2, playerInfo);
        this.sugarDelay = 0;
        this.fruitDelay = 0;
        this.currentRound = 0;
    }
    step() {
        this.currentRound++;
        this.removeSugar();
        this.spawnSugar();
        this.spawnFruit();
        for (let a of this.colony.ants) {
            a.move();
            if (a.traveledDistance > this.colony.antRange) {
                a.vitality = 0;
                this.colony.starvedAnts.push(a);
            }
            else {
                if (a.traveledDistance > this.colony.antRange / 3 && !a.isTired) {
                    a.isTired = true;
                    a.becomesTired();
                }
                if (a.reached)
                    this.antAndTarget(a);
                this.antAndSugar(a);
                if (!a.carriedFruit) {
                    this.antAndFruit(a);
                }
                if (!a.target && a.remainingDistance === 0)
                    a.waits();
                a.tick();
            }
        }
        this.removeAnts();
        this.spawnAnt();
        this.moveFruitAndAnts();
        this.removeFruit();
    }
    render() {
        for (let a of this.colony.ants) {
            a.render();
        }
        for (let s of this.sugarHills) {
            s.render();
        }
        for (let f of this.fruits) {
            f.render();
        }
        this.colony.render();
    }
    spawnAnt() {
        if (this.colony.ants.length < SimSettings.antLimit && this.colony.antDelay < 0) {
            this.colony.newAnt();
            this.colony.antDelay = SimSettings.antRespawnDelay;
        }
        this.colony.antDelay--;
    }
    removeAnts() {
        let antsToRemove = [];
        for (let a of this.colony.starvedAnts) {
            if (a && antsToRemove.indexOf(a) === -1) {
                antsToRemove.push(a);
                this.colony.statistics.starvedAnts++;
                a.hasDied('starved');
            }
        }
        for (let a of antsToRemove) {
            if (a) {
                this.colony.removeAnt(a);
                for (let f of this.fruits) {
                    let carrierIndex = f.carriers.indexOf(a);
                    if (carrierIndex > -1)
                        f.carriers.splice(carrierIndex, 1);
                }
            }
        }
        this.colony.starvedAnts = [];
    }
    antAndTarget(ant) {
        if (ant.target instanceof AntColony) {
            if (ant.carriedFruit)
                return;
            ant.traveledDistance = 0;
            ant.target = null;
            ant.smelledMarker = [];
            ant.colony.statistics.collectedFood += ant.currentLoad;
            ant.currentLoad = 0;
            ant.vitality = ant.maxVitality;
            ant.isTired = false;
        }
        else if (ant.target instanceof Sugar) {
            let t = ant.target;
            ant.target = null;
            if (t.amount <= 0)
                return;
            ant.sugarReached(t);
        }
        else if (ant.target instanceof Fruit) {
            let t = ant.target;
            ant.target = null;
            if (t.amount <= 0)
                return;
            ant.fruitReached(t);
        }
        else {
            if (ant.target instanceof Bug)
                return;
            ant.target = null;
        }
    }
    antAndSugar(ant) {
        for (let s of this.sugarHills) {
            let num = Coordinate.distance(ant.coordinate, s.coordinate);
            if (ant.target !== s && num <= ant.viewDistance) {
                ant.spotsSugar(s);
            }
        }
    }
    antAndFruit(ant) {
        for (let f of this.fruits) {
            let num = Coordinate.distance(ant.coordinate, f.coordinate);
            if (ant.target !== f && num <= ant.viewDistance)
                ant.spotsFruit(f);
        }
    }
    moveFruitAndAnts() {
        for (let f of this.fruits) {
            if (f.carriers.length <= 0)
                continue;
            let dx = 0;
            let dy = 0;
            let load = 0;
            for (let a of f.carriers) {
                if (a.target === f || a.remainingRotation !== 0)
                    continue;
                dx += a.currentSpeed * Math.cos(a.coordinate.direction * Math.PI / 180.0);
                dy += a.currentSpeed * Math.sin(a.coordinate.direction * Math.PI / 180.0);
                load += a.currentLoad;
            }
            load = Math.min(Math.floor(0.0 + load * SimSettings.fruitLoadMultiplier), f.amount);
            dx = dx * load / f.amount / f.carriers.length;
            dy = dy * load / f.amount / f.carriers.length;
            f.coordinate = Coordinate.withDeltas(f.coordinate, dx, dy);
            for (let a of f.carriers) {
                a.coordinate = Coordinate.withDeltas(a.coordinate, dx, dy);
            }
        }
    }
    spawnSugar() {
        if (this.sugarHills.length < SimSettings.sugarLimit && this.sugarDelay <= 0) {
            this.sugarDelay = SimSettings.sugarRespawnDelay;
            let p = this.getRandomPoint();
            let amount = random(SimSettings.minSugarAmount, SimSettings.maxSugarAmount);
            this.sugarHills.push(new Sugar(p.x, p.y, amount));
        }
        this.sugarDelay--;
    }
    removeSugar() {
        this.sugarHills = this.sugarHills.filter(s => s && s.amount > 0);
    }
    spawnFruit() {
        if (this.fruits.length < SimSettings.fruitLimit && this.fruitDelay <= 0) {
            this.fruitDelay = SimSettings.fruitRespawnDelay;
            let p = this.getRandomPoint();
            let amount = random(SimSettings.minFruitAmount, SimSettings.maxFruitAmount);
            this.fruits.push(new Fruit(p.x, p.y, amount));
        }
        this.fruitDelay--;
    }
    removeFruit() {
        for (let f of this.fruits) {
            if (Coordinate.distanceMidPoints(f.coordinate, this.colony.coordinate) <= 5) {
                this.colony.statistics.collectedFood += f.amount;
                f.amount = 0;
                for (let a of f.carriers) {
                    if (a) {
                        a.carriedFruit = null;
                        a.currentLoad = 0;
                        a.remainingDistance = 0;
                        a.remainingRotation = 0;
                        a.goHome();
                    }
                }
                f.carriers = [];
            }
        }
        this.fruits = this.fruits.filter(f => f && f.amount > 0);
    }
    getRandomPoint() {
        let rp = createVector(random(20, width - 20), random(20, height - 20));
        while (rp.dist(this.colony.coordinate.position) < 25) {
            rp = createVector(random(20, width - 20), random(20, height - 20));
        }
        return rp;
    }
}
class Food {
    constructor(x, y, amount) {
        this.coordinate = new Coordinate(x, y, 0);
        this.amount = amount;
    }
    get amount() {
        return this.amountVal;
    }
    set amount(val) {
        this.amountVal = val;
        this.coordinate.radius = Math.floor(Math.round(Math.sqrt(this.amount / Math.PI) * SimSettings.sugarRadiusMultiplier));
    }
}
class Fruit extends Food {
    constructor(x, y, amount) {
        super(x, y, amount);
        this.carriers = [];
    }
    get amount() {
        return this.amountVal;
    }
    set amount(val) {
        this.amountVal = val;
        this.coordinate.radius = Math.floor((SimSettings.fruitRadiusMultiplier * Math.sqrt(this.amount / Math.PI)));
    }
    needsCarriers(colony) {
        let num = 0;
        for (let a of this.carriers) {
            if (a.colony === colony)
                num += a.currentLoad;
        }
        return num * SimSettings.fruitLoadMultiplier < this.amount;
    }
    render() {
        stroke(100);
        fill(10, 230, 10);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius * 2);
    }
}
class Marker {
}
class PlayerStatistics {
    constructor() {
        this.starvedAnts = 0;
        this.collectedFood = 0;
    }
    get points() {
        return Math.floor((SimSettings.pointsForFood * this.collectedFood + SimSettings.pointsForStarvedAnts * this.starvedAnts));
    }
}
class SimSettings {
}
SimSettings.totalRounds = 15000;
SimSettings.displayDebugLabels = false;
SimSettings.sugarLimit = 4;
SimSettings.minSugarAmount = 200;
SimSettings.maxSugarAmount = 200;
SimSettings.sugarRadiusMultiplier = 1.25;
SimSettings.sugarRespawnDelay = 1;
SimSettings.pointsForFood = 1;
SimSettings.pointsForStarvedAnts = -5;
SimSettings.fruitLimit = 4;
SimSettings.minFruitAmount = 250;
SimSettings.maxFruitAmount = 250;
SimSettings.fruitRespawnDelay = 1;
SimSettings.fruitLoadMultiplier = 5;
SimSettings.fruitRadiusMultiplier = 1.25;
SimSettings.antLimit = 50;
SimSettings.antRespawnDelay = 15;
class CasteSettings {
}
class Sugar extends Food {
    constructor(x, y, amount) {
        super(x, y, amount);
    }
    render() {
        stroke(100);
        fill(250);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius * 2);
        if (SimSettings.displayDebugLabels) {
            fill(20);
            textSize(14);
            let tw = textWidth(this.amount.toString());
            text(this.amount, this.coordinate.position.x - tw / 2, this.coordinate.position.y - 16);
        }
    }
}
//# sourceMappingURL=build.js.map
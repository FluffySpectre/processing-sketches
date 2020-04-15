class AntHill {
    constructor(x, y, radius) {
        this.coordinate = new Coordinate(x, y, radius);
    }
    render() {
        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius * 2, this.coordinate.radius * 2);
    }
}
let environment;
let playerCodeAvailable = false;
let playerCodeValid = true;
let simulationEnd = false;
let colonyNameUI, foodValueUI, deadAntsValueUI, pointsValue;
function playerCodeLoaded() {
    playerCodeValid = true;
    let playerInfo = PlayerInfo.fromObject(PLAYER_INFO);
    for (let c of playerInfo.castes) {
        let abilitySum = c.speed + c.rotationSpeed + c.attack + c.load + c.range + c.viewRange + c.vitality;
        if (abilitySum !== 0) {
            console.error('Caste ' + c.name + ' abilities need to add up to zero! Got sum: ' + abilitySum);
            playerCodeValid = false;
        }
    }
    if (playerCodeValid) {
        SimSettings.displayDebugLabels = playerInfo.debug;
        environment = new Environment(playerInfo, 0);
        playerCodeAvailable = true;
        colonyNameUI.html(playerInfo.colonyName);
    }
}
function setup() {
    frameRate(SimSettings.stepsPerSecond);
    let s = windowWidth < windowHeight ? windowWidth : windowHeight;
    var cnv = createCanvas(s, s);
    cnv.style('display', 'block');
    colonyNameUI = select('#colonyName');
    foodValueUI = select('#foodValue');
    deadAntsValueUI = select('#deadAntsValue');
    pointsValue = select('#pointsValue');
}
function windowResized() {
    resizeCanvas(windowWidth, windowWidth);
}
function draw() {
    angleMode(DEGREES);
    background(245, 222, 179);
    if (!playerCodeValid) {
        drawMessage('There are errors in your code. Please check the console.', '#f00');
        return;
    }
    if (!playerCodeAvailable) {
        drawMessage('Loading...', '#fff');
        return;
    }
    if (environment.currentRound < SimSettings.totalRounds) {
        environment.step();
    }
    else {
        simulationEnd = true;
    }
    environment.render();
    if (frameCount % SimSettings.stepsPerSecond === 0) {
        foodValueUI.html(environment.playerColony.statistics.collectedFood.toString());
        deadAntsValueUI.html(environment.playerColony.statistics.starvedAnts.toString());
        pointsValue.html(environment.playerColony.statistics.points.toString());
    }
    if (simulationEnd) {
        drawMessage('Simulation finished!', '#fff');
    }
    if (SimSettings.displayDebugLabels) {
        fill(20);
        textSize(14);
        text('FPS: ' + Math.floor(frameRate()), 10, 20);
        text('Round: ' + environment.currentRound, 10, 36);
    }
}
function drawMessage(msg, textColor) {
    noStroke();
    fill(20, 180);
    rect(0, 0, width, height);
    textSize(24);
    fill(textColor);
    text(msg, width / 2 - textWidth(msg) / 2, height / 2 - 12);
}
class Insect {
    constructor() { }
    init(colony, availableInsects) {
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
        if (this.colony.antHill)
            this.coordinate = new Coordinate(this.colony.antHill.coordinate.position.x, this.colony.antHill.coordinate.position.y, 5);
        else
            this.coordinate = new Coordinate(random(0, width), random(0, height), 5);
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
        this.currentSpeed = this.colony.castesSpeed[this.casteIndex];
        this.currentSpeed -= this.currentSpeed * this.currentLoad / this.colony.castesLoad[this.casteIndex] / 2;
    }
    get maxLoad() {
        return this.colony.castesLoad[this.casteIndex];
    }
    get maxSpeed() {
        return this.colony.castesSpeed[this.casteIndex];
    }
    get rotationSpeed() {
        return this.colony.castesRotationSpeed[this.casteIndex];
    }
    get range() {
        return this.colony.castesRange[this.casteIndex];
    }
    get viewRange() {
        return this.colony.castesViewRange[this.casteIndex];
    }
    get maxVitality() {
        return this.colony.castesVitality[this.casteIndex];
    }
    get attack() {
        if (this.currentLoad !== 0)
            return 0;
        return this.attackVal;
    }
    set attack(value) {
        this.attackVal = value >= 0 ? value : 0;
    }
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
    render() { }
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
        this.goToTarget(this.colony.antHill);
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
                let num = Math.min(this.maxLoad - this.currentLoad, food.amount);
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
    needsCarriers(fruit) {
        return fruit.needsCarriers(this.colony);
    }
    think(message) {
        this.debugMessage = message.length > 100 ? message.substr(0, 100) : message;
    }
}
class BaseAnt extends Insect {
    init(colony, availableInsects) {
        super.init(colony, availableInsects);
        let cIndex = -1;
        if (availableInsects) {
            let antCast = this.determineCaste(availableInsects);
            for (let i = 0; i < colony.castes.length; i++) {
                let cast = colony.castes[i];
                if (cast.name === antCast) {
                    cIndex = i;
                    this.colour = cast.color || this.colour;
                    break;
                }
            }
        }
        if (cIndex > -1) {
            this.casteIndex = cIndex;
        }
        else {
            console.error('Caste not exists! Using default.');
            this.casteIndex = 0;
        }
        this.isTired = false;
        this.vitality = colony.castesVitality[this.casteIndex];
        this.currentSpeed = colony.castesSpeed[this.casteIndex];
        this.attack = colony.castesAttack[this.casteIndex];
    }
    determineCaste(availableInsects) {
        return '';
    }
    waits() { }
    spotsSugar(sugar) { }
    spotsFruit(fruit) { }
    spotsBug(bug) { }
    sugarReached(sugar) { }
    fruitReached(fruit) { }
    becomesTired() { }
    hasDied(death) { }
    tick() { }
    render() {
        push();
        translate(this.coordinate.position.x, this.coordinate.position.y);
        if (this.debugMessage) {
            fill(20);
            textSize(14);
            let tw = textWidth(this.debugMessage);
            text(this.debugMessage, -tw / 2, -14);
        }
        if (SimSettings.displayDebugLabels) {
            noStroke();
            fill(20, 15);
            ellipse(0, 0, this.viewRange * 2);
        }
        rotate(this.coordinate.direction);
        noStroke();
        fill(this.colour);
        rect(-3, -1.5, 6, 3);
        if (this.currentLoad > 0 && !this.carriedFruit) {
            fill(250);
            rect(-2.5, -2.5, 5, 5);
        }
        pop();
    }
}
class Bug extends Insect {
    init(colony, availableInsects) {
        super.init(colony, availableInsects);
        this.coordinate.radius = 6;
        this.vitality = colony.castesVitality[0];
        this.currentSpeed = colony.castesSpeed[0];
        this.attack = colony.castesAttack[0];
        this.colour = 'blue';
        this.vitality = 20;
    }
    render() {
        push();
        translate(this.coordinate.position.x, this.coordinate.position.y);
        if (SimSettings.displayDebugLabels) {
            fill(20);
            textSize(14);
            let tw = textWidth(this.vitality.toString());
            text(this.vitality.toString(), -tw / 2, -14);
        }
        rotate(this.coordinate.direction);
        noStroke();
        fill(this.colour);
        rect(-4, -2.5, 8, 5);
        pop();
    }
}
class CasteAbilityLevel {
}
class CasteAbilities {
    constructor() {
        this.offset = -1;
        this.abilities = [new CasteAbilityLevel(), new CasteAbilityLevel(), new CasteAbilityLevel(), new CasteAbilityLevel()];
        this.abilities[0].speed = 2;
        this.abilities[0].rotationSpeed = 4;
        this.abilities[0].load = 4;
        this.abilities[0].range = 1800;
        this.abilities[0].viewRange = 20;
        this.abilities[0].vitality = 50;
        this.abilities[0].attack = 0;
        this.abilities[1].speed = 4;
        this.abilities[1].rotationSpeed = 8;
        this.abilities[1].load = 5;
        this.abilities[1].range = 2250;
        this.abilities[1].viewRange = 40;
        this.abilities[1].vitality = 100;
        this.abilities[1].attack = 10;
        this.abilities[2].speed = 6;
        this.abilities[2].rotationSpeed = 16;
        this.abilities[2].load = 7;
        this.abilities[2].range = 3400;
        this.abilities[2].viewRange = 80;
        this.abilities[2].vitality = 175;
        this.abilities[2].attack = 20;
        this.abilities[3].speed = 8;
        this.abilities[3].rotationSpeed = 24;
        this.abilities[3].load = 10;
        this.abilities[3].range = 4500;
        this.abilities[3].viewRange = 120;
        this.abilities[3].vitality = 250;
        this.abilities[3].attack = 30;
    }
    minIndex() {
        return this.offset;
    }
    maxIndex() {
        return this.offset + this.abilities.length - 1;
    }
    get(index) {
        if (!Number.isSafeInteger(index) || index < this.offset || index > this.maxIndex()) {
            if (index !== undefined)
                console.error('Caste ability level invalid! Got: ' + index + '. Allowed are: -1, 0, 1, 2');
            return this.abilities[0];
        }
        return this.abilities[index - this.offset];
    }
}
class CasteInfo {
    constructor() {
        this.speed = 0;
        this.rotationSpeed = 0;
        this.load = 0;
        this.range = 0;
        this.viewRange = 0;
        this.vitality = 0;
        this.attack = 0;
    }
    static fromObject(obj) {
        let ci = new CasteInfo();
        ci.name = obj.name || '';
        ci.color = obj.color || null;
        ci.speed = Number.isInteger(obj.speed) ? obj.speed : 0;
        ci.rotationSpeed = Number.isInteger(obj.rotationSpeed) ? obj.rotationSpeed : 0;
        ci.load = Number.isInteger(obj.load) ? obj.load : 0;
        ci.range = Number.isInteger(obj.range) ? obj.range : 0;
        ci.viewRange = Number.isInteger(obj.viewRange) ? obj.viewRange : 0;
        ci.vitality = Number.isInteger(obj.vitality) ? obj.vitality : 0;
        ci.attack = Number.isInteger(obj.attack) ? obj.attack : 0;
        return ci;
    }
}
class Colony {
    constructor(playerInfo) {
        this.insectDelay = 0;
        this.insects = [];
        this.starvedInsects = [];
        this.eatenInsects = [];
        this.insectDelay = 0;
        this.statistics = new PlayerStatistics();
        if (playerInfo) {
            this.playerInfo = playerInfo;
            this.insectClass = 'PlayerAnt';
            this.castes = playerInfo.castes;
            if (this.castes.length === 0)
                this.castes.push(new CasteInfo());
            this.antsInCaste = this.castes.map(c => 0);
            this.castesSpeed = new Array(this.castes.length);
            this.castesRotationSpeed = new Array(this.castes.length);
            this.castesLoad = new Array(this.castes.length);
            this.castesRange = new Array(this.castes.length);
            this.castesViewRange = new Array(this.castes.length);
            this.castesVitality = new Array(this.castes.length);
            this.castesAttack = new Array(this.castes.length);
            let i = 0;
            for (let c of this.castes) {
                this.castesSpeed[i] = SimSettings.casteAbilities.get(c.speed).speed;
                this.castesRotationSpeed[i] = SimSettings.casteAbilities.get(c.rotationSpeed).rotationSpeed;
                this.castesLoad[i] = SimSettings.casteAbilities.get(c.load).load;
                this.castesRange[i] = SimSettings.casteAbilities.get(c.range).range;
                this.castesViewRange[i] = SimSettings.casteAbilities.get(c.viewRange).viewRange;
                this.castesVitality[i] = SimSettings.casteAbilities.get(c.vitality).vitality;
                this.castesAttack[i] = SimSettings.casteAbilities.get(c.attack).attack;
                i++;
            }
        }
        else {
            this.playerInfo = null;
            this.insectClass = 'Bug';
            this.castesSpeed = [SimSettings.bugSpeed];
            this.castesRotationSpeed = [SimSettings.bugRotationSpeed];
            this.castesRange = [Number.MAX_SAFE_INTEGER];
            this.castesViewRange = [0];
            this.castesLoad = [0];
            this.castesVitality = [SimSettings.bugVitality];
            this.castesAttack = [SimSettings.bugAttack];
            this.antsInCaste = [0];
        }
    }
    newInsect() {
        let availableInsects = null;
        if (this.castes && this.castes.length > 0) {
            availableInsects = {};
            let castesCount = 0;
            for (let caste of this.castes) {
                if (!availableInsects.hasOwnProperty(caste.name)) {
                    availableInsects[caste.name] = this.antsInCaste[castesCount];
                }
                castesCount++;
            }
        }
        let ant = eval(`new ${this.insectClass}()`);
        ant.init(this, availableInsects);
        this.insects.push(ant);
        this.antsInCaste[ant.casteIndex]++;
    }
    removeAnt(insect) {
        let ai = this.insects.indexOf(insect);
        if (ai > -1)
            this.insects.splice(ai, 1);
    }
    render() {
        if (this.antHill)
            this.antHill.render();
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
        this.playerColony = new Colony(playerInfo);
        this.playerColony.antHill = new AntHill(width / 2, height / 2, 25);
        this.bugs = new Colony();
        this.sugarDelay = 0;
        this.fruitDelay = 0;
        this.bugDelay = 0;
        this.currentRound = 0;
    }
    step() {
        this.currentRound++;
        this.removeSugar();
        this.spawnSugar();
        this.spawnFruit();
        for (let i = 0; i < this.bugs.insects.length; i++) {
            let b = this.bugs.insects[i];
            b.move();
            if (b.remainingDistance === 0) {
                b.turnToDirection(random(0, 360));
                b.goForward(random(160, 320));
            }
        }
        for (let i = 0; i < this.playerColony.insects.length; i++) {
            let a = this.playerColony.insects[i];
            a.move();
            if (a.traveledDistance > a.range) {
                a.vitality = 0;
                this.playerColony.starvedInsects.push(a);
            }
            else {
                if (a.traveledDistance > a.range / 3 && !a.isTired) {
                    a.isTired = true;
                    a.becomesTired();
                }
                if (a.reached)
                    this.antAndTarget(a);
                this.antAndSugar(a);
                if (!a.carriedFruit) {
                    this.antAndFruit(a);
                }
                this.antAndBug(a);
                if (!a.target && a.remainingDistance === 0)
                    a.waits();
                a.tick();
            }
        }
        this.removeAnts();
        this.spawnAnt();
        this.moveFruitAndAnts();
        this.removeFruit();
        this.removeBugs();
        this.healBugs();
        this.spawnBug();
    }
    render() {
        for (let a of this.playerColony.insects) {
            a.render();
        }
        for (let b of this.bugs.insects) {
            b.render();
        }
        for (let s of this.sugarHills) {
            s.render();
        }
        for (let f of this.fruits) {
            f.render();
        }
        this.playerColony.render();
    }
    spawnAnt() {
        if (this.playerColony.insects.length < SimSettings.antLimit && this.playerColony.insectDelay < 0) {
            this.playerColony.newInsect();
            this.playerColony.insectDelay = SimSettings.antRespawnDelay;
        }
        this.playerColony.insectDelay--;
    }
    removeAnts() {
        let antsToRemove = [];
        for (let i = 0; i < this.playerColony.starvedInsects.length; i++) {
            let a = this.playerColony.starvedInsects[i];
            if (a && antsToRemove.indexOf(a) === -1) {
                antsToRemove.push(a);
                this.playerColony.statistics.starvedAnts++;
                a.hasDied('starved');
            }
        }
        for (let a of antsToRemove) {
            if (a) {
                this.playerColony.removeAnt(a);
                for (let f of this.fruits) {
                    let carrierIndex = f.carriers.indexOf(a);
                    if (carrierIndex > -1)
                        f.carriers.splice(carrierIndex, 1);
                }
            }
        }
        this.playerColony.starvedInsects = [];
    }
    antAndTarget(ant) {
        if (ant.target instanceof AntHill) {
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
            if (ant.target !== s && num <= ant.viewRange) {
                ant.spotsSugar(s);
            }
        }
    }
    antAndFruit(ant) {
        for (let f of this.fruits) {
            let num = Coordinate.distance(ant.coordinate, f.coordinate);
            if (ant.target !== f && num <= ant.viewRange)
                ant.spotsFruit(f);
        }
    }
    antAndBug(ant) {
        for (let b of this.bugs.insects) {
            let num = Coordinate.distance(ant.coordinate, b.coordinate);
            if (ant.target !== b && num <= ant.viewRange)
                ant.spotsBug(b);
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
            if (Coordinate.distanceMidPoints(f.coordinate, this.playerColony.antHill.coordinate) <= 5) {
                this.playerColony.statistics.collectedFood += f.amount;
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
    spawnBug() {
        if (this.bugs.insects.length < SimSettings.bugLimit && this.bugs.insectDelay < 0) {
            this.bugs.newInsect();
            this.bugs.insectDelay = SimSettings.bugRespawnDelay;
        }
        this.bugs.insectDelay--;
    }
    healBugs() {
        if (this.currentRound % SimSettings.bugRegenerationDelay !== 0)
            return;
        console.log('BUGS HEALED');
        for (let b of this.bugs.insects) {
            if (b && b.vitality < b.maxVitality) {
                b.vitality += SimSettings.bugRegenerationValue;
            }
        }
    }
    removeBugs() {
        for (let i = this.bugs.eatenInsects.length - 1; i >= 0; i--) {
            let b = this.bugs.eatenInsects[i];
            if (b) {
                let bIndex = this.bugs.insects.indexOf(b);
                if (bIndex > -1) {
                    this.bugs.insects.splice(bIndex, 1);
                }
            }
        }
        this.bugs.eatenInsects = [];
    }
    getRandomPoint() {
        let rp = createVector(random(20, width - 20), random(20, height - 20));
        while (rp.dist(this.playerColony.antHill.coordinate.position) < 25) {
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
        if (SimSettings.displayDebugLabels && this.carriers.length > 0) {
            fill(20);
            textSize(14);
            let tw = textWidth(this.carriers.length.toString());
            text(this.carriers.length.toString(), this.coordinate.position.x - tw / 2, this.coordinate.position.y - 14);
        }
    }
}
class Marker {
}
class PlayerInfo {
    static fromObject(obj) {
        let pi = new PlayerInfo();
        pi.name = obj.name;
        pi.colonyName = obj.colonyName;
        pi.castes = [];
        if (Array.isArray(obj.castes)) {
            for (let c of obj.castes) {
                pi.castes.push(CasteInfo.fromObject(c));
            }
        }
        pi.debug = obj.debug || false;
        return pi;
    }
}
class PlayerStatistics {
    constructor() {
        this.starvedAnts = 0;
        this.collectedFood = 0;
    }
    get points() {
        return Math.max(Math.floor((SimSettings.pointsForFood * this.collectedFood + SimSettings.pointsForStarvedAnts * this.starvedAnts)), 0);
    }
}
class SimSettings {
}
SimSettings.stepsPerSecond = 30;
SimSettings.totalRounds = 7300;
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
SimSettings.casteAbilities = new CasteAbilities();
SimSettings.bugSpeed = 2;
SimSettings.bugRotationSpeed = 5;
SimSettings.bugVitality = 1000;
SimSettings.bugAttack = 50;
SimSettings.bugLimit = 4;
SimSettings.bugRespawnDelay = 1;
SimSettings.bugRegenerationDelay = 5;
SimSettings.bugRegenerationValue = 1;
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
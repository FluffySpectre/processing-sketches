class BaseAnt {
    constructor() { }

    init(colony) {
        this.colony = colony;
        this.remainingDistance = 0;
        this.remainingRotation = 0;
        this.targetVal = null;
        this.reached = false;
        this.traveledDistance = 0;
        this.vitality = 100;
        this.maxVitality = 100;
        this.coordinate = new Coordinate(colony.coordinate.position.x, colony.coordinate.position.y, 5);
        this.rotationSpeed = 10;
        this.currentSpeed = 2;
        this.viewDistance = 20;
        this.carriedFruit = null;
        this.currentLoad = 0;
        this.maxLoad = SimSettings.antMaxLoad;
        this.debugMessage = null;
        this.isTired = false;
        this.smelledMarker = [];

        this.w = 6;
        this.h = 3;
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
                this.coordinate.setDirection(180 - this.coordinate.direction);
            else if (this.coordinate.direction > 180 && this.coordinate.direction < 270)
                this.coordinate.setDirection(540 - this.coordinate.direction);
        }
        else if (this.coordinate.position.x > width) {
            this.coordinate.position.x = width - this.coordinate.position.x;
            if (this.coordinate.direction >= 0 && this.coordinate.direction < 90)
                this.coordinate.setDirection(180 - this.coordinate.direction);
            else if (this.coordinate.direction > 270 && this.coordinate.direction < 360)
                this.coordinate.setDirection(540 - this.coordinate.direction);
        }
        if (this.coordinate.position.y < 0) {
            this.coordinate.position.y = -this.coordinate.position.y;
            // if (this.coordinate.direction <= 180 || this.coordinate.direction >= 360)
            //     return;
            this.coordinate.setDirection(360 - this.coordinate.direction);
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

    // player events
    awakes() { }
    waits() { }
    spotsSugar(sugar) { }
    spotsFruit(fruit) { }
    sugarReached(sugar) { }
    fruitReached(fruit) { }
    becomesTired() { }
    hasDied(death) { }
    tick() { }

    // player commands
    // moving
    goForward(distance) {
        if (!distance || Number.isNaN(distance)) distance = Number.MAX_SAFE_INTEGER;
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
    // turning
    turnByDegrees(angle) {
        this.remainingRotation = Coordinate.clampAngle(angle);
    }
    turnToTarget(target) {
        if (!target || !target.coordinate) return;
        this.remainingRotation = Coordinate.clampAngle(Coordinate.directionAngle(this.coordinate, target.coordinate) - this.coordinate.direction);
    }
    turnToDirection(direction) {
        this.remainingRotation = Coordinate.clampAngle(direction - this.coordinate.direction);
    }
    turnAround() {
        if (this.remainingRotation > 0) this.remainingRotation = 180;
        else this.remainingRotation = -180;
    }
    // food
    take(food) {
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
    needsCarriers(fruit) {
        return fruit.needsCarriers(this.colony);
    }
    //debug
    think(message) {
        this.debugMessage = message.length > 100 ? message.substr(0, 100) : message;
    }
}
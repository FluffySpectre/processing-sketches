class Ant extends SimObject {
    constructor(name, position, rotation, scale, speed, antHill) {
        super(position, rotation, scale);

        this.name = name;
        this.vitality = 100;
        this.lifetime = 999;
        this.speed = speed;
        this.attackStrength = 10;
        this.antHill = antHill;
        this.target = null;
        this.lastTarget = null;
        this.targetReached = false;
        this.speedModificator = 1;
        this.carryFood = 0;
        this.markerTimer = 0;
        this.col = color(20);
        this.canMove = true;
        this.smelledMarkers = [];
        this.carryFruit = null;

        this.visionSenseRange = 40;
        this.targetReachDist = 5;
        this.carryFoodModificator = 0.5;
        this.carryFruitModificator = 0.1;
        this.maxCarryAmount = 5;
    }

    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime < 0) this.lifetime = 0;

        if (this.lifetime == 0 || this.vitality == 0 || this.carryFruit != null) return;

        this.updateVision();
        this.updateSmelling();

        if (!this.canMove) return;

        if (this.target != null) {
            let t = this.target.position;

            if (this.position.dist(t) > this.targetReachDist) {
                this.targetReached = false;
                this.turnTo(t);

                this.move();
            } else {
                // STOP!
                if (!this.targetReached) {
                    this.targetReached = true;

                    if (this.target instanceof AntHill)
                        this.homeReached(this.target);
                    else if (this.target instanceof Food)
                        this.foodReached(this.target);
                }
            }
        } else {
            // we have no target, so just roam on the playground
            this.rotation.rotate(radians(random(-10, 10)));
            this.move();
        }

        this.markerTimer += deltaTime;
        if (this.carryFood > 0 && this.lastTarget != null && this.markerTimer > 0.5) {
            this.markerTimer = 0;
            let behind = createVector(this.rotation.x, this.rotation.y);
            behind.rotate(radians(180));
            behind.normalize();
            this.setMarker(30, behind);
        }
    }

    render() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.rotation.heading());
        noStroke();
        fill(this.col);
        rect(0, 0, this.scale.x, this.scale.y);
        stroke(150);

        if (this.carryFood > 0) {
            fill(250);
            rect(0, 0, 5, 5);
        }

        if (displayAntSenseRange) {
            // draw sense radius
            noStroke();
            fill(150, 0, 150, 50);
            ellipse(this.scale.x / 2, this.scale.y / 2, this.visionSenseRange, this.visionSenseRange);
        }

        pop();

        if (displayLabels) {
            fill(20);
            text(this.name, this.position.x - 20, this.position.y - 15);
        }
    }

    move() {
        this.position.x += this.rotation.x * this.speed * this.speedModificator;
        this.position.y += this.rotation.y * this.speed * this.speedModificator;
    }

    setMarker(radius, direction) {
        this.antHill.setMarkerAtPosition(this, this.position, radius, direction);
    }

    // MOVING
    moveTo(target) {
        this.target = target;
        this.canMove = true;
    }

    moveHome() {
        this.target = this.antHill;
        this.canMove = true;
    }

    stop() {
        this.target = null;
        this.canMove = false;
    }

    // TURNING
    turnTo(target) {
        let dir = p5.Vector.sub(target, this.position);
        this.rotation = dir.normalize();
    }

    turnAround() {
        this.rotation.rotate(radians(180));
    }

    // FOOD
    take(food) {
        if (food instanceof Fruit) {
            this.carryFood = food.amount;
            food.pickup(this);
            this.carryFruit = food;

        } else {
            this.carryFood = food.pickup(this.maxCarryAmount);
            if (this.carryFood == 0) this.lastTarget = null;
            else this.lastTarget = food;

            this.speedModificator = this.carryFoodModificator;
        }
    }

    drop() {
        this.carryFood = 0;

        if (this.carryFruit != null) {
            //carryFruit.drop(this);
            this.carryFruit = null;
        }
    }

    // NAV
    foodReached(food) {}
    homeReached(antHill) {}

    // SENSING
    seesFood(food) {}
    seesFruit(fruit) {}
    seesBug(bug) {}
    smellsMarker(marker) {}

    updateVision() {
        for (let f of food) {
            if (this.position.dist(f.position) < this.visionSenseRange) {
                if (f instanceof Fruit)
                    this.seesFruit(f);
                else
                    this.seesFood(f);
            }
        }

        for (let b of bugs) {
            if (this.position.dist(b.position) < this.visionSenseRange) {
                this.seesBug(b);
            }
        }
    }

    updateSmelling() {
        for (let m of this.antHill.marker) {
            if (this.position.dist(m.position) < this.visionSenseRange && this.smelledMarkers.indexOf(m) === -1) {
                this.smelledMarkers.push(m);
                this.smellsMarker(m);
            }
        }
    }
}
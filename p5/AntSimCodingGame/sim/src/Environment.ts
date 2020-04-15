class Environment {
    sugarHills: Sugar[];
    fruits: Fruit[];
    playerColony: Colony;
    bugs: Colony;
    sugarDelay: number;
    fruitDelay: number;
    bugDelay: number;
    currentRound: number;

    constructor(playerInfo: PlayerInfo, randSeed: number) {
        if (randSeed !== 0) randomSeed(randSeed);

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

    // this is the main simulation loop
    step() {
        this.currentRound++;

        this.removeSugar();
        this.spawnSugar();
        this.spawnFruit();

        for (let i=0; i<this.bugs.insects.length; i++) {
            let b = this.bugs.insects[i] as Bug;

            b.move();
            
            if (b.remainingDistance === 0) {
                b.turnToDirection(random(0, 360));
                b.goForward(random(160, 320));
            }
        }

        for (let i = 0; i<this.playerColony.insects.length; i++) {
            let a = this.playerColony.insects[i] as BaseAnt;

            // check the suroundings of the ant
            let nearAnts = this.getAntsInViewRange(a);
            a.colonyCount = nearAnts[0] as number;
            a.casteCount = nearAnts[1] as number;
            let nearestColonyAnt = nearAnts[2] as BaseAnt;

            let nearBugs = this.getBugsInViewRange(a);
            a.bugCount = nearBugs[0] as number;
            let nearestBug = nearBugs[1] as Bug;

            a.move();

            if (a.traveledDistance > a.range) {
                a.vitality = 0;
                this.playerColony.starvedInsects.push(a);
            } else {
                if (a.traveledDistance > a.range / 3 && !a.isTired) {
                    a.isTired = true;
                    a.becomesTired();
                }

                if (nearestBug && !(a.target instanceof Bug))
                    a.spotsBug(nearestBug);
                if (nearestColonyAnt && !(a.target instanceof BaseAnt))
                    a.spotsFriend(nearestColonyAnt);
                
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
        this.removeBugs();
        this.healBugs();
        this.spawnBug();
    }

    // this is the main render loop of this simulation
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
        for (let i = 0; i< this.playerColony.starvedInsects.length; i++) {
            let a = this.playerColony.starvedInsects[i] as BaseAnt;
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

    antAndTarget(ant: BaseAnt) {
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
            if (ant.target instanceof Bug) // TODO: maybe create a base class for ants and bugs (e.g. Insect)
                return;
            ant.target = null;
        }
    }

    antAndSugar(ant: BaseAnt) {
        for (let s of this.sugarHills) {
            let num = Coordinate.distance(ant.coordinate, s.coordinate);
            if (ant.target !== s && num <= ant.viewRange) {
                ant.spotsSugar(s);
            }
        }
    }

    antAndFruit(ant: BaseAnt) {
        for (let f of this.fruits) {
            let num = Coordinate.distance(ant.coordinate, f.coordinate);
            if (ant.target !== f && num <= ant.viewRange)
                ant.spotsFruit(f);
        }
    }

    // antAndMarker(ant: BaseAnt) {
    //     let marker = ant.playerColony.marker.findMarker(ant);
    //     if (!marker)
    //         return;
    //     ant.smellsFriend(marker);
    //     ant.smelledMarker.push(marker);
    // }

    moveFruitAndAnts() {
        for (let f of this.fruits) {
            if (f.carriers.length <= 0) continue;
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

        for (let b of this.bugs.insects) {
            if (b && b.vitality < b.maxVitality) {
                b.vitality += SimSettings.bugRegenerationValue;
            }
        }
    }

    removeBugs() {
        for (let i = this.bugs.eatenInsects.length - 1; i >= 0; i--) {
            let b = this.bugs.eatenInsects[i] as Bug;
            if (b) {
                let bIndex = this.bugs.insects.indexOf(b);
                if (bIndex > -1) {
                    this.bugs.insects.splice(bIndex, 1);
                }
            }
        }
        this.bugs.eatenInsects = [];
    }

    getBugsInViewRange(insect: Insect) {
        let numBugs = 0;
        let nearestBug = null, nearestBugDist = Number.MAX_SAFE_INTEGER;
        for (let b of this.bugs.insects) {
            if (b === insect) continue; // ignore ourself

            let distSqr = Coordinate.distanceSqr(insect.coordinate, b.coordinate);
            if (distSqr <= insect.viewRange * insect.viewRange) {
                if (distSqr < nearestBugDist) {
                    nearestBugDist = distSqr;
                    nearestBug = b;
                }
                numBugs++;
            }
        }
        return [numBugs, nearestBug];
    }

    getAntsInViewRange(insect: Insect) {
        let numColonyAnts = 0, numCasteAnts = 0;
        let nearestAnt = null, nearestAntDist = Number.MAX_SAFE_INTEGER;
        for (let a of this.playerColony.insects) {
            if (a === insect) continue; // ignore ourself

            // distanceSqr is used here because of performance reasons
            let distSqr = Coordinate.distanceSqr(insect.coordinate, a.coordinate);
            if (distSqr <= insect.viewRange * insect.viewRange) {
                if (distSqr < nearestAntDist) {
                    nearestAntDist = distSqr;
                    nearestAnt = a;
                }

                numColonyAnts++;
                if (a.casteIndex === insect.casteIndex) {
                    numCasteAnts++;
                }
            }
        }
        return [numColonyAnts, numCasteAnts, nearestAnt];
    }

    getRandomPoint() {
        let rp = createVector(random(20, width - 20), random(20, height - 20));
        while (rp.dist(this.playerColony.antHill.coordinate.position) < 25) {
            rp = createVector(random(20, width - 20), random(20, height - 20));
        }
        return rp;
    }
}
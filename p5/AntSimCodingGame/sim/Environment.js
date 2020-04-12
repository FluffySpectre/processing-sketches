class Environment {
    constructor(randSeed) {
        if (randSeed !== 0) randomSeed(randSeed);

        this.sugarHills = [];
        this.fruits = [];
        this.colony = new AntColony(width / 2, height / 2);

        this.sugarDelay = 0;
        this.fruitDelay = 0;
    }

    // this is the main simulation loop
    step() {
        this.removeSugar();
        this.spawnSugar();
        this.spawnFruit();

        for (let a of this.colony.ants) {
            a.move();

            if (a.traveledDistance > this.colony.antRange) {
                a.energy = 0;
                this.colony.starvedAnts.push(a);
            } else {
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
    }

    // this is the main render loop of this simulation
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
            ant.energy = ant.maxEnergy;
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

    antAndSugar(ant) {
        for (let s of this.sugarHills) {
            let num = Coordinate.distance(ant.coordinate, s.coordinate);
            if (ant.target !== s && num <= ant.viewDistance)
                ant.spotsSugar(s);
        }
    }

    antAndFruit(ant) {
        for (let f of this.fruits) {
            let num = Coordinate.distance(ant.coordinate, f.coordinate);
            if (ant.target !== f && num <= ant.viewDistance)
                ant.spotsFruit(f);
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


    getRandomPoint() {
        let rp = createVector(random(20, width - 20), random(20, height - 20));
        while (rp.dist(this.colony.coordinate.position) < 25) {
            rp = createVector(random(20, width - 20), random(20, height - 20));
        }
        return rp;
    }
}
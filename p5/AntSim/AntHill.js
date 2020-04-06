class AntHill extends SimObject {
    constructor(position, rotation, scale) {
        super(position, rotation, scale);

        this.ants = [];
        this.marker = [];
        this.time = 0;
        this.antSpawnTime = 0;
        this.antCount = 0;

        this.warriorAntProbabilty = 0.2;

        this.antNames = [
            'Anke', 'Matthias', 'Roland', 'Bernhard', 'Werner', 'Joachim', 'Petra', 'Björn', 'Anja', 'Carsten', 'Benjamin', 'Timon', 'Yannik', 'Maike', 'Jens', 'Dennis', 'Christine', 'Sebastian', 'Tim'
        ];
    }

    spawnAnt() {
        this.spawnAntAtPos(this.position.x, this.position.y);
    }

    spawnAntAtPos(x, y) {
        let antName = this.antNames[Math.round(random(this.antNames.length - 1))];

        let ant;
        if (random(1) < this.warriorAntProbabilty) {
            ant = new WarriorAnt(antName, createVector(x, y), createVector(random(-1, 1), random(-1, 1)), createVector(5, 2), random(1.5, 1.8), this);
        } else {
            ant = new CollectorAnt(antName, createVector(x, y), createVector(random(-1, 1), random(-1, 1)), createVector(5, 2), random(1.5, 1.8), this);
        }
        this.ants.push(ant);
        this.antCount++;
    }

    removeAnt(ant) {
        this.ants.splice(this.ants.indexOf(ant), 1);
        this.antCount--;
    }

    setMarkerAtPosition(ant, position, radius, direction, target) {
        let m = new Marker(createVector(position.x, position.y), createVector(0, 0), createVector(1, 1), radius, direction, target);
        this.marker.push(m);
    }

    update(deltaTime) {
        this.antSpawnTime += deltaTime;
        if (this.antCount < maxAnts && this.antSpawnTime > antSpawnDelay) {
            this.spawnAnt();
            this.antSpawnTime = 0;
        }

        // update ants
        for (let i = this.ants.length - 1; i >= 0; i--) {
            let ant = this.ants[i];

            ant.update(deltaTime);
            ant.render();

            if (ant.hitsWalls()) {
                ant.rotation.rotate(radians(180));
            }

            for (let j = bugs.length - 1; j >= 0; j--) {
                let b = bugs[j];

                if (ant.intersecting(b)) {
                    ant.vitality = 0;
                    killedAntsThroughBugs++;

                    // hit the bug
                    b.vitality -= ant.attackStrength;
                    if (b.vitality <= 0) {
                        killedBugs++;
                        bugs.splice(bugs.indexOf(b), 1);
                    }
                }
            }

            //ant.turnTo(new PVector(mouseX, mouseY));

            if (ant.lifetime <= 0 || ant.vitality <= 0) {
                this.removeAnt(ant);
            }
        }

        // update marker
        for (let i = this.marker.length - 1; i >= 0; i--) {
            let m = this.marker[i];
            m.update(deltaTime);
            m.render();

            if (m.isDead) {
                this.marker.splice(this.marker.indexOf(m), 1);
            }
        }
    }

    render() {
        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(this.position.x, this.position.y, this.scale.x, this.scale.y);
    }
}
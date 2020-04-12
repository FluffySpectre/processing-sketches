class AntColony {
    constructor(x, y) {
        this.coordinate = new Coordinate(x, y, 25);
        this.ants = [];
        this.starvedAnts = [];
        this.antDelay = 0;
        this.antCountDown = 2;
        this.statistics = new PlayerStatistics();

        this.antRange = 1000;
    }

    newAnt() {
        let ant = new PlayerAnt();
        ant.init(this);
        ant.awakes();
        this.ants.push(ant);
    }

    removeAnt(ant) {
        let ai = this.ants.indexOf(ant);
        if (ai > -1)
            this.ants.splice(ai, 1);
    }

    render() {
        stroke(100);
        fill(222, 184, 135, 255);
        ellipse(this.coordinate.position.x, this.coordinate.position.y, this.coordinate.radius*2, this.coordinate.radius*2);
    }
}
class AntColony {
    coordinate: Coordinate;
    ants: BaseAnt[];
    starvedAnts: BaseAnt[];
    antDelay = 0;
    statistics: PlayerStatistics;

    // colony ant stats
    antRange: number;
    antBaseSpeed: number;
    antMaxLoad: number;

    constructor(x: number, y: number) {
        this.coordinate = new Coordinate(x, y, 25);
        this.ants = [];
        this.starvedAnts = [];
        this.antDelay = 0;
        this.statistics = new PlayerStatistics();

        this.antRange = 1800;
        this.antBaseSpeed = 2;
        this.antMaxLoad = 5;
    }

    newAnt() {
        // @ts-ignore
        let ant = new PlayerAnt();
        ant.init(this);
        ant.awakes();
        this.ants.push(ant);
    }

    removeAnt(ant: BaseAnt) {
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
class AntColony {
    coordinate: Coordinate;
    ants: BaseAnt[];
    starvedAnts: BaseAnt[];
    antDelay = 0;
    statistics: PlayerStatistics;
    playerInfo: PlayerInfo;

    // colony ant stats
    antRange: number;
    antBaseSpeed: number;
    antMaxLoad: number;
    castes: any[];
    antsInCaste: number[];

    constructor(x: number, y: number, playerInfo: PlayerInfo) {
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
                    // @ts-ignore
                    availableAnts[caste.name] = this.antsInCaste[castesCount];
                }
                castesCount++;
            }
        }

        // @ts-ignore
        let ant = new PlayerAnt();
        ant.init(this, availableAnts);
        this.ants.push(ant);
        this.antsInCaste[ant.casteIndex]++;
        ant.awakes();
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
class PlayerStatistics {
    starvedAnts: number;
    collectedFood: number;

    constructor() {
        this.starvedAnts = 0;
        this.collectedFood = 0;
    }

    get points() {
        return Math.floor((SimSettings.pointsForFood * this.collectedFood + SimSettings.pointsForStarvedAnts * this.starvedAnts));
    }
}
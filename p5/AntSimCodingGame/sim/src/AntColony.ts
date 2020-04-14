class AntColony {
    coordinate: Coordinate;
    ants: BaseAnt[];
    starvedAnts: BaseAnt[];
    antDelay = 0;
    statistics: PlayerStatistics;
    playerInfo: PlayerInfo;

    // castes stats
    castesSpeed: number[];
    castesRotationSpeed: number[];
    castesLoad: number[];
    castesRange: number[];
    castesViewRange: number[];
    castesVitality: number[];
    castesAttack: number[];

    // colony ant stats
    castes: CasteInfo[];
    antsInCaste: number[];

    constructor(x: number, y: number, playerInfo: PlayerInfo) {
        this.coordinate = new Coordinate(x, y, 25);
        this.ants = [];
        this.starvedAnts = [];
        this.antDelay = 0;
        this.statistics = new PlayerStatistics();
        this.playerInfo = playerInfo;

        this.castes = playerInfo.castes;
        if (this.castes.length === 0)
            this.castes.push(new CasteInfo());
        this.antsInCaste = this.castes.map(c => 0);

        this.castesSpeed = new Array<number>(this.castes.length);
        this.castesRotationSpeed = new Array<number>(this.castes.length);
        this.castesLoad = new Array<number>(this.castes.length);
        this.castesRange = new Array<number>(this.castes.length);
        this.castesViewRange = new Array<number>(this.castes.length);
        this.castesVitality = new Array<number>(this.castes.length);
        this.castesAttack = new Array<number>(this.castes.length);

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
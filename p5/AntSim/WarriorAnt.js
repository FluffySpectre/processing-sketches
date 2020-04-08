class WarriorAnt extends BaseAnt {
    constructor(name, position, rotation, scale, speed, antHill) {
        super(name, position, rotation, scale, speed, antHill);

        this.col = color(255, 0, 0);
    }

    seesBug(bug) {
        this.moveTo(bug);
    }
}
/// <reference path="Insect.ts"/>

class Bug extends Insect {
    init(colony: Colony, availableInsects: {[key: string]: number}) {
        super.init(colony, availableInsects);

        this.radius = 6;
        this.vitality = colony.castesVitality[0];
        this.currentSpeed = colony.castesSpeed[0];
        this.attack = colony.castesAttack[0];
        this.colour = 'blue';
    }

    render() {
        push();
        translate(this.position.x, this.position.y);

        rotate(this.direction);
        noStroke();
        fill(this.colour);
        rect(-4, -2.5, 8, 5);

        pop();
    }
}

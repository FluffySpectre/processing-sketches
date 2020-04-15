/// <reference path="Insect.ts"/>

class Bug extends Insect {
    init(colony: Colony, availableInsects: {[key: string]: number}) {
        super.init(colony, availableInsects);

        this.coordinate.radius = 6;
        this.vitality = colony.castesVitality[0];
        this.currentSpeed = colony.castesSpeed[0];
        this.attack = colony.castesAttack[0];
        this.colour = 'blue';
    }

    render() {
        push();
        translate(this.coordinate.position.x, this.coordinate.position.y);

        if (SimSettings.displayDebugLabels) {
            fill(20);
            textSize(14);
            let tw = textWidth(this.vitality.toString());
            text(this.vitality.toString(), -tw / 2, -14);
        }

        rotate(this.coordinate.direction);
        noStroke();
        fill(this.colour);
        rect(-4, -2.5, 8, 5);

        pop();
    }
}

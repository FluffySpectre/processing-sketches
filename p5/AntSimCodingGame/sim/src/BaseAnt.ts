/// <reference path="Insect.ts"/>

class BaseAnt extends Insect {
    isTired: boolean;
    name: string;

    init(colony: Colony, availableInsects: {[key: string]: number}) {
        super.init(colony, availableInsects);
    
        let cIndex = -1;
        let antCast = '';
        if (availableInsects) {
            antCast = this.determineCaste(availableInsects);
            for (let i=0; i<colony.castes.length; i++) {
                let cast = colony.castes[i];
                if (cast.name === antCast) {
                    cIndex = i;
                    this.colour = cast.color || this.colour;
                    break;
                }
            }
        }
        if (cIndex > -1) {
            this.casteIndex = cIndex;
            // console.log('Cast set to: ' + colony.castes[this.casteIndex].name);
        } else {
            if (colony.castes[0].name) // no error for default caste
                console.error('Caste not exists: ' + antCast + '. Using default instead.');

            this.casteIndex = 0;
        }

        this.isTired = false;
        this.name = random(SimSettings.antNames);
        this.vitality = colony.castesVitality[this.casteIndex];
        this.currentSpeed = colony.castesSpeed[this.casteIndex];
        this.attack = colony.castesAttack[this.casteIndex];
    }

    determineCaste(availableInsects: {[key: string]: number}): string { 
        return ''; 
    }

    // player events
    waits() { }
    spotsSugar(sugar: Sugar) { }
    spotsFruit(fruit: Fruit) { }
    spotsBug(bug: Bug) { }
    spotsFriend(ant: BaseAnt) { }
    smellsFriend(marker: Marker) { }
    sugarReached(sugar: Sugar) { }
    fruitReached(fruit: Fruit) { }
    becomesTired() { }
    underAttack(bug: Bug) { }
    hasDied(death: string) { }
    tick() { }

    // rendering
    render() {
        push();
        translate(this.position.x, this.position.y);

        if (this.debugMessage) {
            fill(20);
            textSize(12);
            let tw = textWidth(this.debugMessage);
            text(this.debugMessage, -tw / 2, -14);
        }

        if (SimSettings.displayDebugLabels) {
            noStroke();
            fill(20, 15);
            ellipse(0, 0, this.viewRange*2);
        }

        rotate(this.direction);
        noStroke();
        fill(this.colour);
        rect(-3, -1.5, 6, 3);

        if (this.currentLoad > 0 && !this.carriedFruit) {
            fill(250);
            rect(-2.5, -2.5, 5, 5);
        }

        pop();
    }
}
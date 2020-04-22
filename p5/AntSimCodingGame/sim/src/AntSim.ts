let environment: Environment;
let playerCodeAvailable = false;
let playerCodeValid = true;
let simulationEnd = false;

// stats ui
let colonyNameUI: p5.Element, foodValueUI: p5.Element, deadAntsValueUI: p5.Element, killedBugsValueUI: p5.Element, pointsValue: p5.Element;

let showInfoMaxDuration = 5;
let showInfoDuration = 0;
let showInfoObject: any = null;
let showInfoPosition: p5.Vector = null;

function playerCodeLoaded() {
    playerCodeValid = true;

    // @ts-ignore check the playerinfo values
    let playerInfo = PlayerInfo.fromObject(PLAYER_INFO);
    for (let c of playerInfo.castes) {
        let abilitySum = c.speed + c.rotationSpeed + c.attack + c.load + c.range + c.viewRange + c.vitality;
        if (abilitySum !== 0) {
            console.error('Caste ' + c.name + ' abilities need to add up to zero! Got sum: ' + abilitySum);
            playerCodeValid = false;
        }
    }

    if (playerCodeValid) {
        SimSettings.displayDebugLabels = playerInfo.debug;
        environment = new Environment(playerInfo, 0);

        playerCodeAvailable = true;

        colonyNameUI.html(playerInfo.colonyName);
    }
}

function playerCodeError() {
    playerCodeValid = false;   
}

function onSimSpeedChanged(selectedSpeed: number) {
    let speeds = [1, 2, 4, 8, 16];
    SimSettings.stepMultiplicator = selectedSpeed >= 0 && selectedSpeed < speeds.length ? speeds[selectedSpeed] : 1;
}

function setup() {
    frameRate(SimSettings.stepsPerSecond);

    let s = 800;
    var cnv = createCanvas(s, s);
    cnv.style('display', 'block');

    colonyNameUI = select('#colonyName');
    foodValueUI = select('#foodValue');
    deadAntsValueUI = select('#deadAntsValue');
    killedBugsValueUI = select('#killedBugsValue');
    pointsValue = select('#pointsValue');
}

// function windowResized() {
//     let s = windowWidth < windowHeight ? windowWidth : windowHeight;
//     resizeCanvas(s - 40, s - 20);
// }

function draw() {
    angleMode(DEGREES);
    background(245, 222, 179);

    if (!playerCodeValid) {
        drawMessage('There are errors in your code. Please check the console.', '#f00');
        return;
    }

    if (!playerCodeAvailable) {
        drawMessage('Loading...', '#fff');
        return;
    }

    for (let i = 0; i < SimSettings.stepMultiplicator; i++) {
        if (environment.currentRound < SimSettings.totalRounds) {
            environment.step();
        } else {
            // simulation ended
            simulationEnd = true;
        }
    }

    environment.render();

    // update stats ui
    if (frameCount % SimSettings.stepsPerSecond === 0) {
        foodValueUI.html(environment.playerColony.statistics.collectedFood.toString());
        deadAntsValueUI.html(environment.playerColony.statistics.totalDeadAnts.toString());
        killedBugsValueUI.html(environment.playerColony.statistics.killedBugs.toString());
        pointsValue.html(environment.playerColony.statistics.points.toString());
    }

    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let mouseCoord = new Coordinate(mouseX, mouseY, 0);

        let selectionRadius = 15;
        let nearestObject: any = null, nearestObjectDist = Number.MAX_SAFE_INTEGER;
        for (let s of environment.sugarHills) {
            let fDist = Coordinate.distance(mouseCoord, s);
            if (s && fDist < selectionRadius) {
                if (fDist < nearestObjectDist) {
                    nearestObjectDist = fDist;
                    nearestObject = s;
                }
            }
        }
        for (let f of environment.fruits) {
            let fDist = Coordinate.distance(mouseCoord, f);
            if (f && fDist < selectionRadius) {
                if (fDist < nearestObjectDist) {
                    nearestObjectDist = fDist;
                    nearestObject = f;
                }
            }
        }

        if (nearestObject) {
            showInfoDuration = showInfoMaxDuration;
            showInfoObject = nearestObject;
            showInfoPosition = nearestObject.position;
        } else {
            for (let i=0; i<environment.bugs.insects.length; i++) {
                let b = environment.bugs.insects[i] as Bug;
                let bDist = Coordinate.distance(mouseCoord, b);
                if (b && bDist < selectionRadius) {
                    if (bDist < nearestObjectDist) {
                        nearestObjectDist = bDist;
                        nearestObject = b;
                    }
                }
            }

            for (let i=0; i<environment.playerColony.insects.length; i++) {
                let a = environment.playerColony.insects[i] as BaseAnt;
                let aDist = Coordinate.distance(mouseCoord, a);
                if (a && aDist < selectionRadius) {
                    if (aDist < nearestObjectDist) {
                        nearestObjectDist = aDist;
                        nearestObject = a;
                    }
                }
            }

            if (nearestObject) {
                showInfoDuration = showInfoMaxDuration;
                showInfoObject = nearestObject;
                showInfoPosition = nearestObject.position;
            }
        }
    }

    if (simulationEnd) {
        drawMessage('Simulation finished!', '#fff');
    }

    if (SimSettings.displayDebugLabels) {
        fill(20);
        textSize(12);
        text('FPS: ' + Math.floor(frameRate()), 10, 20);
        text('Round: ' + environment.currentRound, 10, 36);
    }

    if (showInfoDuration > 0) {
        showInfoDuration--;
        if (showInfoObject instanceof Sugar)
            drawInfo('Sugar', 'Amount: ' + showInfoObject.amount.toString(), showInfoPosition);
        else if (showInfoObject instanceof Fruit)
            drawInfo('Apple', 'Amount: ' + showInfoObject.amount.toString(), showInfoPosition);
        else if (showInfoObject instanceof BaseAnt)
            drawInfo('Ant ' + showInfoObject.name, 'Vitality: ' + showInfoObject.vitality.toString(), showInfoPosition);
        else if (showInfoObject instanceof Bug)
            drawInfo('Bug', 'Vitality: ' + showInfoObject.vitality.toString(), showInfoPosition);
    }
}

function drawMessage(msg: string, textColor: string) {
    noStroke();
    fill(20, 180);
    rect(0, 0, width, height);
    textSize(24);
    fill(textColor);
    text(msg, width/2-textWidth(msg)/2, height/2-12);
}

function drawInfo(firstLine: string, secondLine: string, position: p5.Vector) {
    fill(20);
    textSize(12);
    let tw = textWidth(firstLine);
    text(firstLine, position.x - tw / 2, position.y - 32);
    let tw2 = textWidth(secondLine);
    text(secondLine, position.x - tw2 / 2, position.y - 16);
}
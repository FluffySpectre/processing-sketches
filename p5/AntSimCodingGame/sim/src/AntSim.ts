let environment: Environment;
let playerCodeAvailable = false;
let playerCodeValid = true;
let simulationEnd = false;

// stats ui
let colonyNameUI: p5.Element, foodValueUI: p5.Element, deadAntsValueUI: p5.Element, pointsValue: p5.Element;

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
        environment = new Environment(playerInfo, 0);

        playerCodeAvailable = true;

        colonyNameUI.html(playerInfo.colonyName);
    }
}

function setup() {
    frameRate(SimSettings.stepsPerSecond);

    let s = windowWidth < windowHeight ? windowWidth : windowHeight;
    var cnv = createCanvas(s, s);
    cnv.style('display', 'block');

    colonyNameUI = select('#colonyName');
    foodValueUI = select('#foodValue');
    deadAntsValueUI = select('#deadAntsValue');
    pointsValue = select('#pointsValue');
}

function windowResized() {
    resizeCanvas(windowWidth, windowWidth);
}

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

    if (environment.currentRound < SimSettings.totalRounds) {
        environment.step();
    } else {
        // simulation ended
        simulationEnd = true;
    }
    environment.render();

    // update stats ui
    if (frameCount % 60 === 0) {
        foodValueUI.html(environment.colony.statistics.collectedFood.toString());
        deadAntsValueUI.html(environment.colony.statistics.starvedAnts.toString());
        pointsValue.html(environment.colony.statistics.points.toString());
    }

    if (simulationEnd) {
        drawMessage('Simulation finished!', '#fff');
    }

    if (SimSettings.displayDebugLabels) {
        fill(20);
        textSize(14);
        text('FPS: ' + Math.floor(frameRate()), 10, 20);
        text('Round: ' + environment.currentRound, 10, 36);
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
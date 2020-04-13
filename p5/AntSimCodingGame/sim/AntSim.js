let environment;
let playerCodeAvailable = false;

function playerCodeLoaded() {
    environment = new Environment(0);

    playerCodeAvailable = true;
}

function setup() {
    var cnv = createCanvas(windowWidth, windowWidth);
    cnv.style('display', 'block');
}

function windowResized() {
    resizeCanvas(windowWidth, windowWidth);
}

function draw() {
    angleMode(DEGREES);
    background(245, 222, 179);

    if (!playerCodeAvailable) return;

    if (environment.currentRound < SimSettings.totalRounds) {
        environment.step();
    } else {
        // simulation ended

    }
    environment.render();

    fill(20);
    text('Round: ' + environment.currentRound, 10, 20);
    text('Points: ' + environment.colony.statistics.points, 10, 36);
}
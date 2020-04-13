let environment: Environment;
let playerCodeAvailable = false;

function playerCodeLoaded() {
    // @ts-ignore - PLAYER_INFO comes from the player's code
    environment = new Environment(PLAYER_INFO, 0);

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
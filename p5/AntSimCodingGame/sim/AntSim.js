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

    environment.step();
    environment.render();
}
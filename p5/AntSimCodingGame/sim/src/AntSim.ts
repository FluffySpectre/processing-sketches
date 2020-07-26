const canvasSize = 800;

let renderer: Renderer;
let environment: Environment;
let playerCodeAvailable = false;
let playerCodeValid = true;
let playerInfo: PlayerInfo;
let simulationEnd = false;
let simulationPlay = true;
let simulationStep = false;

// stats ui
let colonyNameUI: p5.Element, foodValueUI: p5.Element, deadAntsValueUI: p5.Element, killedBugsValueUI: p5.Element, pointsValue: p5.Element;

let showInfoMaxDuration = 5;
let showInfoDuration = 0;
let showInfoObject: any = null;
let showInfoPosition: p5.Vector = null;
let objectInfoName: string;
let objectInfoValue: string;

function playerCodeLoaded(playerInfoObj: any) {
    playerCodeValid = true;

    // @ts-ignore check the playerinfo values
    playerInfo = PlayerInfo.fromObject(playerInfoObj);
    for (let c of playerInfo.castes) {
        let abilitySum = c.speed + c.rotationSpeed + c.attack + c.load + c.range + c.viewRange + c.vitality;
        if (abilitySum !== 0) {
            console.error('Caste ' + c.name + ' abilities need to add up to zero! Got sum: ' + abilitySum);
            playerCodeValid = false;
        }
    }

    if (playerCodeValid) {
        startSimulation();
    }
}

function playerCodeError() {
    playerCodeValid = false;   
}

function onMessage(evt: MessageEvent) {
    if (evt.data.type === 'playerCodeLoaded') {
        playerCodeLoaded(evt.data.param);
    } else if (evt.data.type === 'playerCodeError') {
        playerCodeError();
    } else if (evt.data.type === 'simSpeedChanged') {
        onSimSpeedChanged(evt.data.param);
    } else if (evt.data.type === 'pause') {
        simulationPlay = false;
    } else if (evt.data.type === 'play') {
        simulationPlay = true;
    } else if (evt.data.type === 'step') {
        simulationPlay = false;
        simulationStep = true;
    }  else if (evt.data.type === 'restart') {
        startSimulation();
    } else if (evt.data.type === 'rendererChanged') {
        onRendererChanged(evt.data.param);
    }
}

function onSimSpeedChanged(selectedSpeed: number) {
    let speeds = [1, 2, 4, 8, 16];
    SimSettings.stepMultiplicator = selectedSpeed >= 0 && selectedSpeed < speeds.length ? speeds[selectedSpeed] : 1;
}

function onRendererChanged(selectedRenderer: number) {
    if (selectedRenderer === 0) {
        renderer = new Renderer2D(canvasSize, canvasSize);
    } else if (selectedRenderer === 1) {
        renderer = new Renderer3D(canvasSize, canvasSize);
    }
}

function startSimulation() {
    SimSettings.displayDebugLabels = playerInfo.debug;
    environment = new Environment(playerInfo, 0);

    playerCodeAvailable = true;
    simulationPlay = true;
    simulationStep = false;
    simulationEnd = false;

    colonyNameUI.html(playerInfo.colonyName);
}

function onSimulationEnd() {
    window.postMessage({ type: 'simEnded' }, '*');
    simulationEnd = true;
}

function setup() {
    frameRate(SimSettings.stepsPerSecond);

    renderer = new Renderer3D(canvasSize, canvasSize);

    angleMode(DEGREES);

    colonyNameUI = select('#colonyName');
    foodValueUI = select('#foodValue');
    deadAntsValueUI = select('#deadAntsValue');
    killedBugsValueUI = select('#killedBugsValue');
    pointsValue = select('#pointsValue');

    // listen for post messages
    window.addEventListener('message', onMessage, false);
}

function draw() {
    if (!playerCodeValid) {
        drawMessage('There are errors in your code. Please check the console.', '#f00');
        return;
    }

    if (!playerCodeAvailable) {
        drawMessage('Loading...', '#fff');
        return;
    }

    // simulate
    if (simulationPlay || simulationStep) {
        simulationStep = false;
        for (let i = 0; i < SimSettings.stepMultiplicator; i++) {
            if (environment.currentRound < SimSettings.totalRounds) {
                environment.step();
            } else {
                // simulation ended
                onSimulationEnd();
            }
        }
    }

    handleSelection();

    // render
    if (renderer) {
        const simState = environment.getState();
        if (objectInfoName) {
            simState.selectionState = {
                selectedObjectPositionX: showInfoPosition.x,
                selectedObjectPositionY: showInfoPosition.y,
                selectedObjectName: objectInfoName,
                selectedObjectInfo: objectInfoValue,
            };
        }
        renderer.render(simState);
    }

    // update stats ui
    if (frameCount % SimSettings.stepsPerSecond === 0) {
        foodValueUI.html(environment.playerColony.statistics.collectedFood.toString());
        deadAntsValueUI.html(environment.playerColony.statistics.totalDeadAnts.toString());
        killedBugsValueUI.html(environment.playerColony.statistics.killedBugs.toString());
        pointsValue.html(environment.playerColony.statistics.points.toString());
    }
}

function handleSelection() {
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

    objectInfoName = null;
    objectInfoValue = null;
    if (showInfoDuration > 0) {
        showInfoDuration--;

        switch (true) {
            case showInfoObject instanceof Sugar:
                objectInfoName = 'Sugar';
                objectInfoValue = 'Amount: ' + showInfoObject.amount.toString();
                break;
            case showInfoObject instanceof Fruit:
                objectInfoName = 'Apple';
                objectInfoValue = 'Amount: ' + showInfoObject.amount.toString();
                break;
            case showInfoObject instanceof BaseAnt:
                objectInfoName = 'Ant';
                objectInfoValue = 'Vitality: ' + showInfoObject.vitality.toString();
                break;
            case showInfoObject instanceof Bug:
                objectInfoName = 'Bug';
                objectInfoValue = 'Vitality: ' + showInfoObject.vitality.toString();
                break;
        }
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

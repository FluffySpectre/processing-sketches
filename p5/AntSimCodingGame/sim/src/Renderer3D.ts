class Renderer3D implements Renderer {
    private cam: p5.Camera;

    constructor(canvasWidth: number, canvasHeight: number) {
        const cnv = createCanvas(canvasWidth, canvasHeight, WEBGL);
        cnv.style('display', 'block');

        this.cam = createCamera();
        this.cam.move(0, -canvasWidth*0.75, canvasWidth*0.05);
        this.cam.lookAt(0, 0, 0);
    }

    render(state: SimState) {
        background(50, 140, 193);

        // @ts-ignore
        orbitControl(2, 2, -0.05);

        rotateX(90);
        translate(-width/2, -height/2);

        ambientLight(100);
        directionalLight(200, 200, 200, createVector(-45, 90, 0));

        noStroke();
        push();
        translate(width/2, height/2, -0.1);
        fill(245, 222, 179);
        plane(width, height);
        pop();

        // render ants
        for (const antState of state.colonyState.antStates) {
            push();
            translate(antState.positionX, antState.positionY, 1);
    
            if (antState.debugMessage) {
                fill(20);
                textSize(12);
                let tw = textWidth(antState.debugMessage);
                text(antState.debugMessage, -tw / 2, -14);
            }
    
            if (SimSettings.displayDebugLabels) {
                noStroke();
                fill(20, 15);
                ellipse(0, 0, antState.viewRange*2);
            }
    
            rotateZ(antState.direction);
            noStroke();
            fill(antState.colour);
            box(6, 3, 2);
    
            if (antState.loadType === LoadType.Sugar) {
                translate(0, 0, 2.5);
                fill(250);
                box(3, 3, 3);
            }
    
            pop();
        }

        // render bugs
        for (const bugState of state.bugStates) {
            push();
            translate(bugState.positionX, bugState.positionY, 2);

            rotateZ(bugState.direction);
            noStroke();
            fill(bugState.colour);
            box(8, 5, 4);

            pop();
        }

        // render sugar
        for (const sugarState of state.sugarStates) {
            push();
            translate(sugarState.positionX, sugarState.positionY, sugarState.radius / 2);

            noStroke();
            fill(250);
            rotateX(90);
            cone(sugarState.radius, sugarState.radius);

            pop();
        }

        // render apples
        for (const fruitState of state.fruitStates) {
            push();
            translate(fruitState.positionX, fruitState.positionY, fruitState.radius);

            noStroke()
            fill(10, 230, 10);
            sphere(fruitState.radius);
    
            if (SimSettings.displayDebugLabels && fruitState.carriers > 0) {
                fill(20);
                textSize(12);
                let tw = textWidth(fruitState.carriers.toString());
                text(fruitState.carriers.toString(), -(tw / 2), -14);
            }

            pop();
        }

        // render the anthill
        push();
        
        translate(state.colonyState.antHillState.positionX, state.colonyState.antHillState.positionY, state.colonyState.antHillState.radius / 2);

        noStroke();
        fill(222, 184, 135);
        rotateX(90);
        cylinder(state.colonyState.antHillState.radius, state.colonyState.antHillState.radius);
        
        pop();

        // render marker
        for (const markerState of state.colonyState.markerStates) {
            push();
            translate(markerState.positionX, markerState.positionY);

            noStroke();
            fill(240, 240, 10, map(markerState.age, 0, markerState.maxAge, 128, 0));
            sphere(markerState.radius);
            pop();
        }
    }
}

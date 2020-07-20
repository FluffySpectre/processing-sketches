var simPlaying = true;

function pauseSim() {
    window.postMessage({ type: 'pause' }, '*');

    simPlaying = false;
    updatePlayPauseButtons();
}

function playSim() {
    window.postMessage({ type: 'play' }, '*');

    simPlaying = true;
    updatePlayPauseButtons();
}

function stepSim() {
    window.postMessage({ type: 'step' }, '*');

    simPlaying = false;
    updatePlayPauseButtons();
}

function updatePlayPauseButtons() {
    document.getElementById('pauseButton').style.display = simPlaying ? 'block' : 'none';
    document.getElementById('playButton').style.display = !simPlaying ? 'block' : 'none';
}

function simSpeedChanged(simSpeed) {
    window.postMessage({ type: 'simSpeedChanged', param: simSpeed }, '*');
}

function rendererChanged(renderer) {
    window.postMessage({ type: 'rendererChanged', param: renderer }, '*');
}

var geval = eval;

window.load = function (js) {
    var compileFailed = false;
    var compileErr = null;
    if (js) {
        try {
            geval(js);
        } catch (err) {
            console.error('[ANTSIM_COMPILER]', err);
            compileFailed = true;
            compileErr = err;
        }
    }

    setTimeout(function () {
        if (!compileFailed) {
            window.postMessage({ type: 'playerCodeLoaded', param: PLAYER_INFO }, '*');
            
            // display the sim speed controls
            document.getElementById('simSpeedPanel').style.visibility = 'visible';
        } else {
            window.postMessage({ type: 'playerCodeError', param: compileErr }, '*');
        }
    }, 1000);
};

if (receivedJS) {
    window.load(receivedJS);
}

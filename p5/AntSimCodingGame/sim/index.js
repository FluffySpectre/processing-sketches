function simSpeedChanged(simSpeed) {
    onSimSpeedChanged(simSpeed);
}

var geval = eval;

window.load = function (js) {
    if (js) {
        try {
            geval(js);
        } catch (err) {
            var pre = document.createElement('pre');
            pre.appendChild(document.createTextNode(err));
            document.body.insertBefore(pre, document.body.firstChild);
        }
    }

    setTimeout(function () {
        if (typeof window.playerCodeLoaded === 'function')
            window.playerCodeLoaded();
        // display the sim speed controls
        document.getElementById('simSpeedPanel').style.visibility = 'visible';
    }, 1000);
};

if (receivedJS) {
    window.load(receivedJS);
}


// import { compileCode, expose } from './libraries/es.es6.min.js';

// var geval = eval;

// window.load = function (js) {
//     if (js) {
//         const code = compileCode('console.log(BaseAnt)');
//         expose('console', 'Math', 'p5', 'BaseAnt');
//         code({num: 1.8}); // logs 2 to the console

//         // try {
//         //     geval(js);
//         // } catch (err) {
//         //     console.log(err);
//         // }
//     }

//     setTimeout(function () {
//         if (typeof window.playerCodeLoaded === 'function')
//             window.playerCodeLoaded()
//     }, 1000);
// };

// if (receivedJS) {
//     window.load(receivedJS);
// }

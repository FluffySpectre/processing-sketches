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


// const sandboxProxies = new WeakMap()

// function compileCode(src) {
//     src = 'with (sandbox) {' + src + '}';
//     const code = new Function('sandbox', src);

//     return function (sandbox) {
//         if (!sandboxProxies.has(sandbox)) {
//             const sandboxProxy = new Proxy(sandbox, { has, get });
//             sandboxProxies.set(sandbox, sandboxProxy);
//         }
//         return code(sandboxProxies.get(sandbox));
//     }
// }

// function has(target, key) {
//     return true;
// }

// function get(target, key) {
//     if (key === Symbol.unscopables) return undefined;
//     return target[key];
// }

// compileCode('var t = 100; console.log(random(100));')({ console: console, random: (x) => { return random(x) } });
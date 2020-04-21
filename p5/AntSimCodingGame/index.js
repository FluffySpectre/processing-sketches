// GLOBALS
var codeDownloadUrl = null;

// WINDOW RESIZING
function resizeEditor() {
    codeEditor.layout();
}
window.addEventListener('resize', this.resizeEditor);

// CODE EDITOR SETUP
fetch('ant-template.js')
    .then((response) => {
        return response.text()
    })
    .then((data) => {
        codeEditor.setValue(data);
    });

var codeEditor = monaco.editor.create(document.getElementById('editorContainer'), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark',
    minimap: {
        enabled: false
    },
});
codeEditor.onDidChangeModelContent(function (e) {
    // update the download link with the changed code
    var text = codeEditor.getValue();
    var data = new Blob([text], { type: 'text/javascript' });
    if (codeDownloadUrl !== null) {
        // cleanup old url
        window.URL.revokeObjectURL(codeDownloadUrl);
    }
    codeDownloadUrl = window.URL.createObjectURL(data);
    document.getElementById('codeDownloadLink').href = codeDownloadUrl;
});

var runContainer = document.getElementById('simContainer');
var runIframe = null, runIframeHeight = 0;
function run() {
    // hide sim hint text
    document.getElementById('simHint').style.display = 'none';

    if (runIframe) {
        // unload old iframe
        runContainer.removeChild(runIframe);
    }

    // load new iframe
    runIframe = document.createElement('iframe');
    runIframe.id = 'sim';
    runIframe.src = 'sim/index.html';
    runIframe.className = 'run-iframe';
    runIframe.style.boxSizing = 'border-box';
    runIframe.style.height = '100%';
    runIframe.style.width = '100%';
    runIframe.style.border = '0';
    runIframe.frameborder = '0';
    runContainer.appendChild(runIframe);

    runIframe.addEventListener('load', function (e) {
        var antCode = codeEditor.getValue();
        antCode += ';window.PlayerAnt = PlayerAnt;';
        runIframe.contentWindow.load(antCode);
    });
}

// CODE UPLOAD
function codeUploaded() {
    var codeUploadInput = document.getElementById('codeUpload');
    if (codeUploadInput.files.length == 0) {
        return;
    }

    var file = codeUploadInput.files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
        var code = e.target.result;

        // check the code
        // TODO: add some more code checks
        if (code.indexOf('PLAYER_INFO =') > -1 && code.indexOf('class PlayerAnt extends BaseAnt') > -1) {
            codeEditor.setValue(code);
            codeEditor.revealLine(1);
        } else {
            alert('This is not valid AntSim code!');
        }
    });
    reader.readAsText(file);
}

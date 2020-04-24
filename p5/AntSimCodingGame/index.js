// GLOBALS
var codeDownloadUrl = null;
var saveIndicatorTimeoutId = null;
var saveTimeoutId = null;

// WINDOW RESIZING
function resizeEditor() {
    codeEditor.layout();
}
window.addEventListener('resize', this.resizeEditor);

// SAVE
window.addEventListener('keydown', function(e) {
    if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        
        saveCode();
    }
}, false);
function saveCode() {
    if (saveIndicatorTimeoutId !== null)
        clearTimeout(saveIndicatorTimeoutId);
    document.getElementById('codeSaveIndicator').classList.add('show');
    saveIndicatorTimeoutId = setTimeout(function() {
        document.getElementById('codeSaveIndicator').classList.remove('show');
    }, 1000);

    // save the code to localStorage
    localStorage.setItem('code', codeEditor.getValue());
}

// CODE EDITOR SETUP
function createDependencyProposals(range) {
    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor)
    return [
        {
            label: 'goToTarget',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Let the ant move to a target.",
            insertText: 'this.goToTarget(',
            range: range
        },
    ];
}

monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: function (model, position) {
        var word = model.getWordUntilPosition(position);
        var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        };
        return {
            suggestions: createDependencyProposals(range)
        };
    }
});

var codeEditor = monaco.editor.create(document.getElementById('editorContainer'), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark',
    minimap: {
        enabled: false
    },
    fontSize: 16,
    lineNumbers: 'on',
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

    // wait a bit and then auto-save the code
    if (saveTimeoutId !== null)
        clearTimeout(saveTimeoutId);
    saveTimeoutId = setTimeout(function() { saveCode(); }, 1000);
});

// restore saved code or start with the default template
var c = localStorage.getItem('code');
if (c) {
    codeEditor.setValue(c);
} else {
    fetch('ant-template.js')
        .then((response) => {
            return response.text()
        })
        .then((data) => {
            codeEditor.setValue(data);
        });
}

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

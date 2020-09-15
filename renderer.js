var fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs');
const ipc = require('electron').ipcRenderer

let $ = require('jquery');
let userDataPath = "";
let appVersion = "";

ipc.on('getAppPath-reply', (event, arg) => {
    userDataPath = arg;
});

ipc.on('getVersion-reply', (event, arg) => {
    appVersion = arg;
    var currentTitle = document.querySelector("title").innerHTML;
    document.querySelector("title").innerHTML = currentTitle + " - " + appVersion;
});

ipc.send('getAppPath','userData');

ipc.send('getVersion', null);

var levelDbDirectory = path.join(userDataPath,"Local Storage","leveldb");

var specialFoldersPath = null;


ipc.on("html-loaded", (event, args)=>{
    initGrid();
});

//Getting back the information after selecting the file
ipc.on('selected-file', function (event, path) {
    document.querySelector("#selected-file").innerHTML = `${path}`;
});

//Getting back the information after selecting the file
ipc.on('saved-file', function (event, path) {
    document.querySelector("#saved-file").innerHTML = `${path}`;
});

function processFile(){
    console.log("FILESIZE (bytes) : " + fileData.length);
    console.log(fileData);
}

function writeTargetFile(targetData){
    var outFile = document.querySelector("#saved-file").innerHTML;
    alert(outFile);
    console.log(outFile);
    try { fs.writeFileSync(outFile, targetData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}

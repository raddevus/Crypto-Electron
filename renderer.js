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
    $("title").text($("title").text() + " - " + appVersion);
});

ipc.send('getAppPath','userData');

ipc.send('getVersion', null);

var levelDbDirectory = path.join(userDataPath,"Local Storage","leveldb");

var specialFoldersPath = null;

// ## The following is document.onload via jquery
$(function() {
    initGrid();
 });

//Getting back the information after selecting the file
ipc.on('selected-file', function (event, path) {
    $('#selected-file').text(`${path}`);
});

//Getting back the information after selecting the file
ipc.on('saved-file', function (event, path) {
    $('#saved-file').text(`${path}`);
});

function processFile(){
    console.log("FILESIZE (bytes) : " + fileData.length);
    console.log(fileData);
}

function writeTargetFile(targetData){
    var outFile = $("#saved-file").text();
    alert(outFile);
    console.log(outFile);
    try { fs.writeFileSync(outFile, targetData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}

var fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs');
const ipc = require('electron').ipcRenderer

let $ = require('jquery');
//var modal = require('./node_modules/bootstrap/js/dist/modal');
//window.$ = $;

const remote = require('electron').remote;
const app = remote.app;

var levelDbDirectory = path.join(app.getPath('userData'),"Local Storage","leveldb");
//var appsRootPath = app.getPath('appData');
//documents, temp, appData, userData, ("C:\\windows\\system32\\"),

var specialFoldersPath = null;

// ## The following is document.onload via jquery
$(function() {
    initGrid();
    $("title").text($("title").text() + " - " + app.getVersion());
    encryptData();
    decryptData();
 });

 //Getting back the information after selecting the file
 ipc.on('selected-file', function (event, path) {
    //do what you want with the path/file selected, for example:
    $('#selected-file').text(`${path}`);
 });

 //Getting back the information after selecting the file
 ipc.on('saved-file', function (event, path) {
    //do what you want with the path/file selected, for example:
    $('#saved-file').text(`${path}`);
 });

function processFile(){
    console.log("FILESIZE (bytes) : " + fileData.length);
    console.log(fileData);
}

function writeTargetFile(targetData){
    var outFile = $("#saved-file").text();//path.join(app.getAppPath(), 'myfile.enc');
    alert(outFile);
    console.log(outFile);
    try { fs.writeFileSync(outFile, targetData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}

console.log(app.getPath('userData') );
console.log(app.getAppPath() );
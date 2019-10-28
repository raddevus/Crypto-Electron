var fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs')
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
    encryptDecryptTest();
 });

 //Getting back the information after selecting the file
 ipc.on('selected-file', function (event, path) {
    //do what you want with the path/file selected, for example:
    $('#selected-file').text(`You selected: ${path}`);
 });

 //Getting back the information after selecting the file
 ipc.on('saved-file', function (event, path) {
    //do what you want with the path/file selected, for example:
    $('#saved-file').text(`Output file is : ${path}`);
 });

function readFile(){
    var currentSelectedFile = $('#FileListBox').val();
    if (currentSelectedFile == null){
        return;
    }
    
    var fileFullName = path.join(levelDbDirectory, currentSelectedFile);
    alert(fileFullName);
    fs.readFile(fileFullName, 'ascii', function (err, data) {
        if (err) return console.log(err);
        console.log("read the file!");
        fileData = data;

        processFile();
        writeEncryptedFile();
    });
}

function processFile(){
    console.log("FILESIZE (bytes) : " + fileData.length);
    console.log(fileData);
}

function writeEncryptedFile(){
    listFilesInPath(levelDbDirectory);
    var outFile = path.join(app.getAppPath(), 'myfile.log');
    console.log(outFile);
    try { fs.writeFileSync(outFile, fileData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}

console.log(app.getPath('userData') );
console.log(app.getAppPath() );
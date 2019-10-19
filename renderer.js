var fs = require('fs');
const path = require('path');

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var fileData = null;
function readFile(){
    
    fs.readFile(path.join(app.getAppPath(), "main.js"), 'ascii', function (err, data) {
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
    listFilesInPath(path.join(app.getPath('userData'),"Local Storage","leveldb"));
    var outFile = app.getAppPath() + "\\" + 'myfile.log';
    try { fs.writeFileSync(outFile, fileData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}

function listFilesInPath(directoryPath){
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.filter(filterOnExtension).forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
        });
    });
}

function filterOnExtension(element) {
    var extName = path.extname(element);
    console.log("==> " + element);
    const extFilter = ".log";
    return extName === extFilter; 
  };

const remote = require('electron').remote;
const app = remote.app;

console.log(app.getPath('userData') );
console.log(app.getAppPath() );
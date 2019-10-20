var fs = require('fs');
const path = require('path');

let $ = require('jquery');
//var modal = require('./node_modules/bootstrap/js/dist/modal');
//window.$ = $;

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
    var outFile = path.join(app.getAppPath(), 'myfile.log');
    console.log(outFile);
    try { fs.writeFileSync(outFile, fileData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}
var allFiles = [];

function getFileList(){
    
    listFilesInPath(path.join(app.getPath('userData'),"Local Storage","leveldb"));
    console.log(allFiles.length);
    
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
            // LATER - allFiles.push(file);
        });
    });
}

function filterOnExtension(element) {
    var extName = path.extname(element);
    console.log("==> " + element);
    var localOption = new Option(element, element, false, true);
    $('#FileListBox').append($(localOption) );
    
    const extFilter = ".log";
    return extName === extFilter; 
  };

const remote = require('electron').remote;
const app = remote.app;

console.log(app.getPath('userData') );
console.log(app.getAppPath() );
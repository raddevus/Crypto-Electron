var fs = require('fs');
const path = require('path');

let $ = require('jquery');
//var modal = require('./node_modules/bootstrap/js/dist/modal');
//window.$ = $;

const remote = require('electron').remote;
const app = remote.app;

var levelDbDirectory = path.join(app.getPath('userData'),"Local Storage","leveldb");

// ## The following is document.onload via jquery
$(function() {
    $("#sourcePath").text(levelDbDirectory);
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

function getFileList(){
    listFilesInPath(path.join(app.getPath('userData'),"Local Storage","leveldb"));
}

function removeAllFilesFromList(){
$('#FileListBox')
    .find('option')
    .remove()
    .end();
}

function listFilesInPath(directoryPath){
    removeAllFilesFromList();
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.filter(filterOnExtension).forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
            var localOption = new Option(file, file, false, true);
            $('#FileListBox').append($(localOption) );
            // LATER - allFiles.push(file);
        });
    });
}

function filterOnExtension(element) {
    var extName = path.extname(element);
    console.log("==> " + element);
    
    const extFilter = ".log";
    return extName === extFilter; 
  };


console.log(app.getPath('userData') );
console.log(app.getAppPath() );
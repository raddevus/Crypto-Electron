var fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs')

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
    $("#sourcePath").text(levelDbDirectory);
    handleSpecialFoldersChange();
    $("#specialFolders").change(function() {
        handleSpecialFoldersChange();    
    });

 });
 var allDirs = [];
 function getAllDirsButtonClick(){
     allDirs = getAllDirs(specialFoldersPath);
     for (let x = 0; x<allDirs.length;x++){
         appendNewNode("#treeNode",allDirs[x]);
     }
     handleToggle();
 }

 function getAllDirs(path){
    //const getDirectories = source =>
    return readdirSync(path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
 }

 function appendNewNode(targetNode, nodeName){
    $(targetNode).append("<li><span id=\"" + nodeName + "\" class=\"caret\">" + nodeName + "</span></li>");
}

function handleToggle(){
    var toggler = document.getElementsByClassName("caret");
    var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
        try{
            let subpath = path.join(specialFoldersPath,this.id);
            let localParent = null;

            allDirs = getAllDirs(subpath);
            
            for (let k = 0;k <allDirs.length;k++){
                //alert(allDirs[0]);
                if (k == 0){
                    $("#"+this.id).append("<ul id=\"" + allDirs[k] + "\" class=\"nested\"></ul>");
                    localParent=allDirs[0];
                }
                appendNewNode("#"+ localParent, allDirs[k]);
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            }
        }
        catch{
                return;
            }
        });
    }
}

function handleSpecialFoldersChange(){
    clearSelectList("#PathListBox");
    specialFoldersPath = app.getPath($("#specialFolders").val());
    $("#appsRootPath").text(specialFoldersPath);
    getSubPaths(specialFoldersPath);
}

async function getSubPaths(path){
    fs.readdir(path, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
            var localOption = new Option(file, file, false, true);
            $('#PathListBox').append($(localOption) );
            // LATER - allFiles.push(file);
        });
        $("#PathListBox").val($("#PathListBox option:first").val());
    });
}

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

function clearSelectList(targetElementSelector){
    $(targetElementSelector)
        .find('option')
        .remove()
        .end();
}

function listFilesInPath(directoryPath){
    clearSelectList('#FileListBox');
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
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
    getInitialDirectories();
 });
 var allDirs = [];

 function getInitialDirectories(){
     $("#treeNode").empty();
     allDirs = getAllDirs(specialFoldersPath);
     for (let x = 0; x<allDirs.length;x++){
        appendListNode("#treeNode",allDirs[x]);
    }
 }

 function getAllDirsButtonClick(elementSelector,folder){
     var mainPath = path.join(specialFoldersPath,folder);
     console.log(mainPath);
     allDirs = getAllDirs(mainPath);
     for (let x = 0; x<allDirs.length;x++){
         appendListNode(elementSelector,allDirs[x]);
     }
     handleToggle(folder);
 }

 function getAllDirs(path){
    //const getDirectories = source =>
    return readdirSync(path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
 }

 function appendListNode(targetNode, nodeName){
    $(targetNode).append("<li><span id=\"" + nodeName + "\" class=\"caret\">" + nodeName + "</span></li>");
}

function addSubFoldersToParent(clickedElement,folder){
    console.log("clickedElement.id :" + clickedElement.id);
    let subpath = path.join(specialFoldersPath,clickedElement.id,folder);
    console.log(subpath);
    let localParent = null;
    if ($("#"+clickedElement.id).hasClass("hasExpanded") == false){
    $("#"+clickedElement.id).addClass("hasExpanded");
    console.log(subpath);
    allDirs = getAllDirs(subpath);
    console.log("allDirs.length: " + allDirs.length);
    for (let k = 0;k <allDirs.length;k++){
            if (k == 0){
                localParent=clickedElement.id+k;
                $("#"+clickedElement.id).append("<ul id=\"" + localParent + "\" class=\"nested\"></ul>");
            }
            appendListNode("#"+ localParent, allDirs[k])
        }
    }
    clickedElement.parentElement.querySelector(".nested").classList.toggle("active");
    clickedElement.classList.toggle("caret-down");
    
}

function handleToggle(folder){
    var toggler = document.getElementsByClassName("caret");
    console.log("There are " + toggler.length + " toggler items.");
    var i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            console.log("clicked...");
            try{
                //alert(this.id);
                addSubFoldersToParent(this,folder);
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
    getInitialDirectories();
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
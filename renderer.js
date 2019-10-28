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


 function renderNodes(nodes,targetNodeSelector){
     console.log("nodes.length : " + nodes.length);
    for (let x = 0;x < nodes.length;x++){
        // nodes[x].allChildFolderNames[0]+
        //targetName = nodes[x].allChildFolderNames[0];
        let nodeSelector = "#"+nodes[x].allChildFolderNames[0];
        $(targetNodeSelector).append("<ul id=\"" + nodes[x].allChildFolderNames[0] + "\" class=\"nested active\"></ul>");
        appendListNode(nodeSelector,nodes[x].allChildFolderNames[0]).
        on("click", function() 
        {   
            alert($(nodeSelector).id);
        });
    }
 }

 function appendListNode(targetNode, nodeName){
     console.log("targetName : " + targetNode);
    return ($("<li><span id=\"" + nodeName + "\" class=\"caret\">" + nodeName + "</span></li>").appendTo(targetNode));
    
    //return ($(targetNode).append("<li><span id=\"" + nodeName + "\" class=\"caret\">" + nodeName + "</span></li>"));
 }
 
 function addNodeClickHandler(nodeSelector){
    $(nodeSelector).on("click", function() 
        {   
            alert($(nodeSelector).id);
        });
 }

 function addSubsAndClickHandlers(parentNodeSelector){
    for (let x = 0; x<allDirs.length;x++){
        appendListNode(parentNodeSelector,allDirs[x])
        .on("click", function() 
        {   
            let localParent = allDirs[x]+x;
            console.log("localParent : " + localParent);
                $("#"+allDirs[x]).toggleClass("caret-down");
                console.log(allDirs[x]);
                let subdirs = getAllDirs(path.join(specialFoldersPath,allDirs[x]));
                console.log(subdirs.length);
                if ($("#"+allDirs[x]).hasClass("hasExpanded") == false){
                    $("#"+localParent).addClass("hasExpanded");
                    $("#" + allDirs[x]).addClass("hasExpanded");
                    if (subdirs.length > 0){
                        
                        console.log("append...");
                        $("#"+allDirs[x]).append("<ul id=\"" + localParent + "\" class=\"nested active\"></ul>");
                    }
                    for (let k = 0;k <subdirs.length;k++){
                        appendListNode("#" + localParent,subdirs[k]);
                        
                    }
                }
                else{
                $("#"+allDirs[x]).toggleClass("active");
                $("#"+localParent).toggleClass("active");
                }
        });
    }
 }

 function getAllDirs(path){
    //const getDirectories = source =>
    return readdirSync(path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
 }

async function getSubPaths(path){
    // ########################################################
    // ############### TO BE REMOVED / ALTERED ################
    // ######################################################## 
    fs.readdir(path, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
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
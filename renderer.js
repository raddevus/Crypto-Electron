var fs = require('fs');
alert("got it!");
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var fileData = null;
function readFile(){
    
    fs.readFile("C:\\Users\\roger.deutsch\\AppData\\Roaming\\C'YaPass\\Local Storage\\leveldb\\000006.log", 'ascii', function (err, data) {
        if (err) return console.log(err);
        console.log("read the file!");
        fileData = data;

        processFile();
    });
}

function processFile(){
    console.log("FILESIZE (bytes) : " + fileData.length);
    console.log(fileData);
}

readFile();

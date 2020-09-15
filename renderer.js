var fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs');
const ipc = require('electron').ipcRenderer

let userDataPath = "";
let appVersion = "";

ipc.on('getPath-reply', (event, arg) => {
    userDataPath = arg;
});

ipc.on('getVersion-reply', (event, arg) => {
    appVersion = arg;
    var currentTitle = document.querySelector("title").innerHTML;
    document.querySelector("title").innerHTML = currentTitle + " - " + appVersion;
});

ipc.send('getPath','userData');

ipc.send('getVersion', null);

var levelDbDirectory = path.join(userDataPath,"Local Storage","leveldb");

var specialFoldersPath = null;

function replaceText(selector, text){
	const element = document.querySelector("#"+selector)
	if (element){ element.innerText = text;}
} 

function updateDetails(){	
	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type]);
	}
}

ipc.on('getAppPath-reply', (event, arg) => {
	// arg is appDataPath as string
	replaceText(`app-path`,arg);
});

ipc.on("html-loaded", (event, args)=>{
    initGrid();
    updateDetails();
    ipc.send('getAppPath',null);
});

//Getting back the information after selecting the file
ipc.on('selected-file', function (event, path) {
    document.querySelector("#selected-file").innerHTML = `${path}`;
});

//Getting back the information after selecting the file
ipc.on('saved-file', function (event, path) {
    document.querySelector("#saved-file").innerHTML = `${path}`;
});

function processFile(){
    console.log("FILESIZE (bytes) : " + fileData.length);
    console.log(fileData);
}

function writeTargetFile(targetData, isEncrypting){
    var outFile = document.querySelector("#saved-file").innerHTML;
    
    var outMsg = "Successfully ";
    if (isEncrypting){
        outMsg += "encrypted ";
    }
    else{ outMsg+="decrypted ";}
    outMsg += outFile;
    console.log(outMsg);
    alert(outMsg);
    try { fs.writeFileSync(outFile, targetData, 'ascii'); }
    catch(e) { alert('Failed to save the file !'); }
}

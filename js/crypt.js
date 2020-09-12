
var fs = require('fs');

const resizedIV = Buffer.allocUnsafe(16);


let encrypted = "";
let decrypted = "";
let key = "";
let iv = "";
let clearText = btoa("This is a an extremely long message <strong> with </strong> CRLF \n and other items in it.");
let isEncrypting = true;
let decryptionIsSuccess = true;
const DECRYPTION_ERROR_MSG = "ERROR!: Most likely you are using an incorrect password to decrypt the file with.";

function encryptDataBuffer(data){

    var localPwd = document.querySelector("#textBasedPassword").value;
    const key = Crypto.createHash("sha256").update(localPwd).digest();
    const iv = Buffer.allocUnsafe(16);
    // copies only 16 bytes of the key into iv
    key.copy(iv);

    console.log(iv);
    cipher = Crypto.createCipheriv("aes-256-cbc", key,iv);
    // 1. encrypt the byes (call final())
    // 2. return base64 of encrypted bytes
    var x = convertByteDataToString(data);
    console.log("x : " + x.length);
    var msg = [];
    msg.push(cipher.update(data, "binary", "base64"));//, "binary", "hex");
    //console.log(data);
    msg.push(cipher.final("base64"));
    return msg.join("");
}

function convertByteDataToString(data){
    var outString = "";
    for (var i =0;i<data.length;i++){
        outString += String.fromCharCode(data[i]);
    }
    return outString;
}
 

let clearTextOut = "";

function decryptDataBuffer(data){
    // var encryptedBuffer = null;
    // if (data !== undefined && data != ""){
    //     encrypted = atob(data);
    //     console.log("encrypted.length : " + encrypted.length);
    //     console.log(encrypted);
    //     encryptedBuffer = Buffer.from(encrypted, 'ascii' );
    //     console.log(encryptedBuffer);
    // }

    var localPwd = document.querySelector("#textBasedPassword").value;
    console.log(localPwd);
    const key = Crypto.createHash("sha256").update(localPwd).digest();
    const iv = Buffer.allocUnsafe(16);
    // copies only 16 bytes of the key into iv
    key.copy(iv);
    var msg = [];
    console.log(iv);
    cipher = Crypto.createDecipheriv("aes-256-cbc", key, iv);
    // 1. encrypt the byes (call final())
    // 2. return base64 of encrypted bytes
    msg.push(cipher.update(data, "base64", "binary"));//, "hex", "binary");
    //console.log(data);
    msg.push(cipher.final("binary"));
    return msg.join("");
}

function encryptFile(){
    isEncrypting = true;
    if (pwd != ""){
        createOutputFileFromInputData();
    }
}

function decryptFile(){
    isEncrypting = false;
    if (pwd != ""){
        createOutputFileFromInputData();
    }
}

let xdata = undefined;
let xdataString = undefined;

function createOutputFileFromInputData(){
    decryptionIsSuccess = true;
    var currentSelectedFile = $('#selected-file').text();
    if (currentSelectedFile == null){
        return;
    }
    alert(currentSelectedFile);
    
    fs.readFile(currentSelectedFile, function (err, data) {
        if (err) return console.log(err);
        console.log("read the file!");
        xdata = data;
        console.log("xdata");
        console.log(xdata);
        // let dataString = new String();
        // console.log("1 - ### data.length : " + data.length);
        // for (let idx = 0; idx < data.length;idx++){
        //     dataString += String.fromCharCode(data.readUIntBE(idx,1));
        // }
        
        if (isEncrypting){
            // xdataString = dataString.substring(0,dataString.length);
            // outputFileData = encryptDataBuffer(dataString.substring(0,dataString.length));
            outputFileData = encryptDataBuffer(data);
            //outputFileData = encryptDataBuffer("this is the data that I'm done with for now and now this is even longer to see how long it will matter and to see if it makes a difference with 100 percent help")
            console.log(outputFileData);
            //outputFileData = atob(outputFileData.toString());
            //console.log(outputfileData);
        }
        else{
            var base64Data = data.toString("utf8");
            console.log(base64Data);
            outputFileData = decryptDataBuffer(base64Data);
            
        }
        if (decryptionIsSuccess){
            writeTargetFile(outputFileData);
        }
    });
}

function decodeHexString(stringOfHexBytes){
    var localClearText = "";
    var currentByte = "";
    for (var x = 0;x < stringOfHexBytes.length;x++){
        currentByte = stringOfHexBytes[x] + stringOfHexBytes[++x]; 
        localClearText += String.fromCharCode(parseInt(currentByte,16));
    }
    return localClearText;
}

var fs = require('fs');
//const { readFile } = require('fs');

let encrypted = "";
let decrypted = "";
let key = "";
let iv = "";
let clearText = "This is a an extremely long message <strong> with </strong> CRLF \n and other items in it.";
let isEncrypting = true;
let decryptionIsSuccess = true;

function encryptData(data){
    if (data !== undefined && data != ""){
        clearText = data;
    }
    key = CryptoJS.enc.Hex.parse(pwd);
    iv = CryptoJS.enc.Hex.parse(pwd.slice(0,32));
    encrypted = CryptoJS.AES.encrypt(clearText, key, { iv: iv }); 
    //var encrypted = CryptoJS.AES.encrypt(clearText, "Secret"); 
    //var cipherText = CryptoJS.enc.Hex.parse(String(encrypted.ciphertext));
    //console.log("cipherText : " + cipherText);
    document.getElementById("encrypted").innerHTML = encrypted;
    return encrypted;
}

function encryptDataBuffer(data){
    if (data !== undefined && data != ""){
        clearText = data;
        console.log("data.charCodeAt(0) : " +data.charCodeAt(0));
        console.log("clearText.charCodeAt(0) : " +clearText.charCodeAt(0));
        console.log("clearText.length : " + clearText.length);
        console.log("data.length : " + data.length);
    }
    
    key = CryptoJS.enc.Hex.parse(pwd);
    iv = CryptoJS.enc.Hex.parse(pwd.slice(0,32));
    encrypted = CryptoJS.AES.encrypt(clearText, key, { iv: iv }); 
    //var encrypted = CryptoJS.AES.encrypt(clearText, "Secret"); 
    //var cipherText = CryptoJS.enc.Hex.parse(String(encrypted.ciphertext));
    //console.log("cipherText : " + cipherText);
    document.getElementById("encrypted").innerHTML = encrypted;
    return encrypted;
}

function decryptData(data){
    if (data !== undefined && data != ""){
        encrypted = data;
    }
    key = CryptoJS.enc.Hex.parse(pwd);
    iv = CryptoJS.enc.Hex.parse(pwd.slice(0,32));
    decrypted = CryptoJS.AES.decrypt(encrypted,  key, { iv: iv });
    //var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret");
    console.log("decrypted: " + decrypted.toString());
    let clearTextOut = decodeHexString(decrypted.toString());
    if (clearTextOut.length <= 200){
        console.log(clearTextOut);
        document.getElementById("decrypted").innerHTML = clearTextOut;
    }
    return clearTextOut;
}
let clearTextOut = "";
function decryptDataBuffer(data){
    if (data !== undefined && data != ""){
        encrypted = atob(data);
        console.log("encrypted.length : " + encrypted.length);
    }
    key = CryptoJS.enc.Hex.parse(pwd);
    iv = CryptoJS.enc.Hex.parse(pwd.slice(0,32));
    decrypted = CryptoJS.AES.decrypt(encrypted,  key, { iv: iv });
    //var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret");
    console.log("decrypted: " + decrypted.toString());
    clearTextOut = decodeHexString(decrypted.toString());
    try{
    clearTextOut = atob(clearTextOut);
    }
    catch{
        decryptionIsSuccess = false;
        console.log("ERROR!: Most likely you are using an incorrect password to decrypt the file with.");
        alert("ERROR!: Most likely you are using an incorrect password to decrypt the file with.");
    }
    //clearTextOut = clearTextOut.substring(0,clearTextOut.length);
    if (clearTextOut.length <= 200){
        console.log(clearTextOut);
        document.getElementById("decrypted").innerHTML = clearTextOut;
    }
    return clearTextOut;
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
    if ($("#useDataBufferCheckBox").attr('checked') || $("#useDataBufferCheckBox").prop('checked')){
        fs.readFile(currentSelectedFile, function (err, data) {
            if (err) return console.log(err);
            console.log("read the file!");
            xdata = data;
            // let dataString = new String();
            // console.log("1 - ### data.length : " + data.length);
            // for (let idx = 0; idx < data.length;idx++){
            //     dataString += String.fromCharCode(data.readUIntBE(idx,1));
            // }
            
            if (isEncrypting){
                // xdataString = dataString.substring(0,dataString.length);
                // outputFileData = encryptDataBuffer(dataString.substring(0,dataString.length));
                outputFileData = encryptDataBuffer(data.base64Slice(0,data.length));
            }
            else{
                outputFileData = decryptDataBuffer(data.base64Slice(0,data.length));
            }
            //processFile();
            if (decryptionIsSuccess){
                writeTargetFile(outputFileData);
            }
        });
     }
    else{
        fs.readFile(currentSelectedFile, 'ascii', function (err, data) {
            if (err) return console.log(err);
            console.log("read the file!");
            if (isEncrypting){
                outputFileData = encryptData(data);
            }
            else{
                outputFileData = decryptData(data);
            }
            //processFile();
            writeTargetFile(outputFileData);
        });
    }
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
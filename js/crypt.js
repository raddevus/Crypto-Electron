
var fs = require('fs');
//const { readFile } = require('fs');

let encrypted = "";
let decrypted = "";
let key = "";
let iv = "";
let clearText = "This is a an extremely long message <strong> with </strong> CRLF \n and other items in it.";
let isEncrypting = true;

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
function createOutputFileFromInputData(){
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
            if (isEncrypting){
                outputFileData = encryptDataBuffer(data.asciiSlice(0,data.length));
            }
            else{
                outputFileData = decryptData(data);
            }
            //processFile();
            writeTargetFile(outputFileData);
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
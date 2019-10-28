
var fs = require('fs');
//const { readFile } = require('fs');

let encrypted = "";
let decrypted = "";
let key = "";
let iv = "";
let clearText = "This is a an extremely long message <strong> with </strong> CRLF \n and other items in it.";

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

function decryptData(){
    decrypted = CryptoJS.AES.decrypt(encrypted,  key, { iv: iv });
    //var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret");
    console.log("decrypted: " + decrypted.toString());
    let clearTextOut = decodeHexString(decrypted.toString());
    console.log(clearTextOut);
    document.getElementById("decrypted").innerHTML = clearTextOut;
}

function encryptFile(fileData){
    clearText = fileData;
    if (pwd != ""){
        readClearTextFile();
    }
}

let EncryptedFileData = "";

function readClearTextFile(){
    var currentSelectedFile = $('#selected-file').text();
    if (currentSelectedFile == null){
        return;
    }
    alert(currentSelectedFile);
    fs.readFile(currentSelectedFile, 'ascii', function (err, data) {
        if (err) return console.log(err);
        console.log("read the file!");
        fileData = data;
        encryptedFileData = encryptData(data);
        processFile();
        writeEncryptedFile(encryptedFileData);
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
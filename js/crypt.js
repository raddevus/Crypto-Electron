
var fs = require('fs');
//var Crypto = require('crypto');
//const { readFile } = require('fs');
const Crypto = require('crypto');

const resizedIV = Buffer.allocUnsafe(16);


let encrypted = "";
let decrypted = "";
let key = "";
let iv = "";
let clearText = btoa("This is a an extremely long message <strong> with </strong> CRLF \n and other items in it.");
let isEncrypting = true;
let decryptionIsSuccess = true;
const DECRYPTION_ERROR_MSG = "ERROR!: Most likely you are using an incorrect password to decrypt the file with.";

function doEncrypt(){
//     var crypto = require('crypto');

// var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
// resizedIV = Buffer.allocUnsafe(16);
//         var iv = crypto
//          .createHash("sha256")
//          .update("a")
//          .digest();
// var cipher = createCipheriv("aes256",'mypasswrod',iv);
// var mystr = mykey.update('abc', 'utf8', 'hex')
// mystr += mykey.final('hex');

// console.log(mystr);


const key = Crypto.createHash("sha256").update("a").digest();
const iv = Crypto.createHash("sha256").update("a").digest();


    iv.copy(resizedIV);

    console.log(resizedIV);
    console.log(iv);
    
    console.log(key);
    const cipher = Crypto.createCipheriv("aes-256-cbc", key, resizedIV);
    console.log(cipher);
    var msg = [];

        console.log("a");
        msg.push(cipher.update("a", "binary", "hex"));
    
    console.log(msg.length);
    msg.push(cipher.final("hex"));
    
    var hexString = msg.join("").toUpperCase();
    console.log(hexString);
    console.log(Buffer.from(hexString).toString('base64'));

    

}

function encryptDataBuffer(data){
    // if (data !== undefined && data != ""){
    //     clearText = data;
    //     console.log("data.charCodeAt(0) : " +data.charCodeAt(0));
    //     console.log("clearText.charCodeAt(0) : " +clearText.charCodeAt(0));
    //     console.log("clearText.length : " + clearText.length);
    //     console.log("data.length : " + data.length);
    // }
    // create a buffer for the 16-byte iv
    cipher = Crypto.createCipheriv("aes256", pwd, pwd.slice(0,32));
    // 1. encrypt the byes (call final())
    // 2. return base64 of encrypted bytes
    cipher.update(data, "binary", "binary")
    return cipher.final(data,"utf8").toString("base64");
    // key = CryptoJS.enc.Hex.parse(pwd);
    // iv = CryptoJS.enc.Hex.parse(pwd.slice(0,32));
    // encrypted = CryptoJS.AES.encrypt(clearText, key, { iv: iv }); 
    // //var encrypted = CryptoJS.AES.encrypt(clearText, "Secret"); 
    // //var cipherText = CryptoJS.enc.Hex.parse(String(encrypted.ciphertext));
    // //console.log("cipherText : " + cipherText);
    // document.getElementById("encrypted").innerHTML = encrypted;
    // return encrypted;
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
        // ## It can successfully decode bytes but then those bytes
        // ## are actually equal to an empty string.  That's an error 
        // ## that is related to using the wrong password.
        if (clearTextOut.length <= 0){
            decryptionIsSuccess = false;
            alert(DECRYPTION_ERROR_MSG);
            console.log(DECRYPTION_ERROR_MSG);
        }
    }
    catch{
        decryptionIsSuccess = false;
        console.log(DECRYPTION_ERROR_MSG);
        alert(DECRYPTION_ERROR_MSG);
    }
    //clearTextOut = clearTextOut.substring(0,clearTextOut.length);
    if (clearTextOut.length <= 200){
        console.log(clearTextOut);
        document.getElementById("decrypted").innerHTML = clearTextOut;
    }
    return clearTextOut;
}

function encryptFile(){
    doEncrypt(); return;
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
            // outputFileData = encryptDataBuffer(data);
            doEncrypt();
        }
        else{
            outputFileData = decryptDataBuffer(data.base64Slice(0,data.length));
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
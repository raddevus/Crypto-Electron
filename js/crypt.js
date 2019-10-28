
function encryptDecryptTest(){
    var plainText = "This is a an extremely long message <strong> with </strong> CRLF \n and other items in it.";
    var key = CryptoJS.enc.Hex.parse(pwd);
    var iv = CryptoJS.enc.Hex.parse(pwd.slice(0,32));
    var encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv }); 
    //var encrypted = CryptoJS.AES.encrypt(plainText, "Secret"); 
    //var cipherText = CryptoJS.enc.Hex.parse(String(encrypted.ciphertext));
    //console.log("cipherText : " + cipherText);
    document.getElementById("encrypted").innerHTML = encrypted;
    var decrypted = CryptoJS.AES.decrypt(encrypted,  key, { iv: iv });
    //var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret");
    console.log("decrypted: " + decrypted.toString());
    let plainTextOut = decodeHexString(decrypted.toString());
    console.log(plainTextOut);
    document.getElementById("decrypted").innerHTML = plainTextOut;
}

function encryptFile(){
    if (pwd != ""){
        encryptDecryptTest();
    }
}

function decodeHexString(stringOfHexBytes){
    var localPlainText = "";
    var currentByte = "";
    for (var x = 0;x < stringOfHexBytes.length;x++){
        currentByte = stringOfHexBytes[x] + stringOfHexBytes[++x]; 
        localPlainText += String.fromCharCode(parseInt(currentByte,16));
    }
return localPlainText;
}
const fs = require('fs');
const crypto = require('crypto');
const fsasync = fs.promises;
const remote = require('electron').remote;
const main = remote.require('./main.js');

//Klickevent für das Verschlüsseln
document.getElementById('encBtn').addEventListener('click', () =>{
    var usedFor = document.getElementById('used-for').value;
    var password = document.getElementById('password').value;
    var masterPassword = document.getElementById('master-password').value;

    var content = usedFor + ": " + encrypt(masterPassword, password) + "\n";
    fsasync.appendFile('passwords.txt', content, 'utf8');
})

//Klickevent für das Entschlüsseln
document.getElementById('decBtn').addEventListener('click', () =>{
    var usedFor = document.getElementById('used-for').value;
    var masterPassword = document.getElementById('master-password').value;    
    var allPasswords = fs.readFileSync('passwords.txt','utf8').toString();

   //Hole Passwort anhand des Verwendungszwecks aus der Datei.    
    var password = allPasswords.substring(allPasswords.indexOf(usedFor+": "));
    password = password.substring(0,password.indexOf("\n"));
    password = password.substring(password.indexOf(" ")+1).toString();
    
    document.getElementById('password').value = decrypt(password, masterPassword);
})

//Klickevent für das Anzeigen des Passworts
showPwBtn.addEventListener('click', () =>{
    var password = document.getElementById('password');
    if(password.type == 'password'){        
        password.type = 'text';
    }
    else{
        password.type = 'password';
    }
})

PwListBtn.addEventListener('click', () =>{
    main.newBrowserWindow();
})

//Funktion für die Verschlüsselung
function encrypt (masterPassword, password){
    var key = crypto.createCipher('aes-128-cbc', masterPassword);
    var str = key.update(password, 'utf8', 'hex')
    str += key.final('hex');
    
    return(str);
}

//Funktion für die Entschlüsselung
function decrypt(string, key) {
    var decipher = crypto.createDecipher('aes-128-cbc', key)
    var dec = decipher.update(string, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec;
}
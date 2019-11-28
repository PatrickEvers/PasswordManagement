const fs = require('fs');
const fsasync = fs.promises;
const crypto = require('crypto');
const remote = require('electron').remote;
const main = remote.require('./main.js');

var allPasswords = fs.readFileSync('passwords.txt','utf8').toString().split('\n');
document.getElementById("main").style.display = "none";

//Aufteilung von Verwendungszweck & Passwort
for(var i=0;i<allPasswords.length;i++){
    allPasswords[i] = allPasswords[i].split(' ');
}

//Schreibe Passwörter in die Tabelle
for(var i=0;i<allPasswords.length;i++){
    if(allPasswords[i] != ""){
        var tr = document.createElement('tr')
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var input = document.createElement('input');
        var button = document.createElement('button');

        td1.textContent = allPasswords[i][0];
        input.value = allPasswords[i][1];
        input.type = 'password';
        input.readOnly = true;
        input.id = 'pw'+(i+1);
        button.textContent = 'Passwort anzeigen';
        button.id = (i+1);
        button.addEventListener('click', showPassword)

        document.getElementById('main-table').appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        td2.appendChild(input);
        td3.appendChild(button);
    }
}

//Klickevent für das Verschlüsseln
document.getElementById('encBtn').addEventListener('click', () =>{
    var usedFor = document.getElementById('used-for').value;
    var password = document.getElementById('password').value;
    var masterPassword = document.getElementById('master-password').value;

    var content = usedFor + ": " + encrypt(masterPassword, password) + "\n";
    fsasync.appendFile('passwords.txt', content, 'utf8');
})

//Klickevent für den Button zum Setzen des Master-Passworts
MPwBtn.addEventListener('click', () =>{
    var form = document.getElementById("main");
    if (form.style.display === "none") {
      form.style.display = "block";
      document.getElementById("setMPw").style.display = "none";
    }    
})

//Funktion für die Verschlüsselung
function encrypt (masterPassword, password){
    var key = crypto.createCipher('aes-128-cbc', masterPassword);
    var str = key.update(password, 'utf8', 'hex')
    str += key.final('hex');
    
    return(str);
}

//Funktion zum Anzeigen/Verstecken des Passworts.
//TODO: Usereingabe des keys
function showPassword(event){
    var input = document.getElementById('pw'+event.target.id);
    var key = 'Hi';

    if(input.type == 'password'){       
        var string = input.value;
        var decipher = crypto.createDecipher('aes-128-cbc', key)
        var dec = decipher.update(string, 'hex', 'utf8')
        dec += decipher.final('utf8')
        input.value = dec;        
        input.type = 'text';
    }
    else{
        var string = input.value;
        var cipher = crypto.createCipher('aes-128-cbc', key);
        var enc = cipher.update(string, 'utf8', 'hex')
        enc += cipher.final('hex');
        input.value = enc;
        input.type = 'password';
    }
}
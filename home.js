const fs = require('fs');
const fsasync = fs.promises;
const crypto = require('crypto');

var allPasswords = fs.readFileSync('passwords.txt','utf8').toString().split('\n');
document.getElementById("main").style.display = "none";

//Aufteilung von Verwendungszweck & Passwort
for(var i=0;i<allPasswords.length;i++){
    allPasswords[i] = allPasswords[i].split(' ');
}

//Schreibe Passwörter in die Tabelle
for(var i=0;i<allPasswords.length;i++){
    if(allPasswords[i] != ""){
        var tr = document.createElement('tr');
        var tdHead = document.createElement('td');
        var tdUsage = document.createElement('td');
        var tdPassword = document.createElement('td');
        var tdButton = document.createElement('td');
        var input = document.createElement('input');
        var button = document.createElement('button');
        var img = document.createElement('img');

        tdHead.id = "table-head";
        tdUsage.id = "table-usage";
        tdPassword.id = "table-password";
        tdButton.id = "table-button";
        
        imgSrc = allPasswords[i][0].substring(0,allPasswords[i][0].lastIndexOf(':')) + "Logo.png";
        if (fs.existsSync(imgSrc)) {
            img.src = imgSrc;
        }
        else{
            img.src = 'electronLogo.png'
        }
        img.alt = "Logo";
        tdHead.appendChild(img);
        
        tdUsage.textContent = allPasswords[i][0];
        input.value = allPasswords[i][1];
        input.type = 'password';
        input.readOnly = true;
        input.id = 'pw'+(i+1);
        button.className = "fa fa-fw fa-eye field_icon toggle-password";
        button.id = (i+1);
        button.addEventListener('click', showPassword);

        document.getElementById('main-table').appendChild(tr);
        tr.appendChild(tdHead);
        tr.appendChild(tdUsage);
        tr.appendChild(tdPassword);
        tr.appendChild(tdButton);
        tdPassword.appendChild(input);
        tdButton.appendChild(button);
    }
}

//Klickevent für das Verschlüsseln & Speichern
document.getElementById('encBtn').addEventListener('click', () =>{
    var usedFor = document.getElementById('used-for');
    var password = document.getElementById('password');
    var masterPassword = document.getElementById('master-password');
    var encPassword = encrypt(masterPassword.value, password.value);
    var content = usedFor.value + ": " + encPassword + "\n";
    fsasync.appendFile('passwords.txt', content, 'utf8');

    var tr = document.createElement('tr');
    var tdHead = document.createElement('td');
    var tdUsage = document.createElement('td');
    var tdPassword = document.createElement('td');
    var tdButton = document.createElement('td');
    var input = document.createElement('input');
    var button = document.createElement('button');
    var img = document.createElement('img');

    var trCount = countTableRows(document.getElementById('main-table'));
    
    tdHead.id = "table-head";
    tdUsage.id = "table-usage";
    tdPassword.id = "table-password";
    tdButton.id = "table-button";
    
    imgSrc = usedFor.value + "Logo.png";
    if (fs.existsSync(imgSrc)) {
        img.src = imgSrc;
    }
    else{
        img.src = 'electronLogo.png'
    }
    img.alt = "Logo";
    tdHead.appendChild(img);

    tdUsage.textContent = usedFor.value + ":";
    input.value = encPassword;
    input.type = 'password';
    input.readOnly = true;
    input.id = 'pw'+ (trCount+1);
    button.className = "fa fa-fw fa-eye field_icon toggle-password";
    button.id = (trCount+1);
    button.addEventListener('click', showPassword);
    
    document.getElementById('main-table').appendChild(tr);
    tr.appendChild(tdHead);
    tr.appendChild(tdUsage);
    tr.appendChild(tdPassword);
    tr.appendChild(tdButton);
    tdPassword.appendChild(input);
    tdButton.appendChild(button);
    usedFor.value = '';
    password.value  = '';
    document.getElementById("myForm").style.display = "none";
})

//Klickevent für den Button zum Setzen des Master-Passworts
MPwBtn.addEventListener('click', () =>{
    var div = document.getElementById("main");
    var input = document.getElementById("master-password");
    if (div.style.display === "none" && input.value !== "") {
        div.style.display = "block";
        document.getElementById("setMPw").style.display = "none";
        document.getElementById("myForm").style.display = "none";
    }    
})

//Klickevent zum Anzeigen der Form für das Hinzufügen eines Passworts
addPwBtn.addEventListener('click', () =>{
    var div = document.getElementById('myForm');
    if (div.style.display === "none") {
        div.style.display = "block";
    }
})

//Funktion für die Verschlüsselung
function encrypt (key, string){
    var cipher = crypto.createCipher('aes-128-cbc', key);
    var enc = cipher.update(string, 'utf8', 'hex')
    enc += cipher.final('hex');
    
    return enc;
}

//Funktion zum Anzeigen/Verstecken des Passworts.
function showPassword(event){
    var input = document.getElementById('pw'+event.target.id);
    var key = document.getElementById('master-password').value;
    var button = document.getElementById(event.target.id);
    
    if(input.type == 'password'){       
        try {
            var string = input.value;
            var decipher = crypto.createDecipher('aes-128-cbc', key)
            var dec = decipher.update(string, 'hex', 'utf8')
            dec += decipher.final('utf8')
        } catch (ex) {
            document.getElementById("main").style.display = "none";
            document.getElementById("setMPw").style.display = "block";
            return;
        }
        input.value = dec;        
        input.type = 'text';
        button.className = "fa fa-fw fa-eye-slash field_icon toggle-password";
    }
    else{
        var string = input.value;
        input.value = encrypt(key, string);
        input.type = 'password';
        button.className = "fa fa-fw fa-eye field_icon toggle-password";
    }
}

//Funktion zum Zählen der Tabellenzeilen
function countTableRows(parent){
        var rows = 0;
        var children = parent.childNodes.length;
        for(var i=0; i < children; i++){
            if(parent.childNodes[i].nodeType != 3){
                rows++;
            }
        }
        return rows;
}
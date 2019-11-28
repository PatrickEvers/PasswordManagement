const fs = require('fs');

var allPasswords = fs.readFileSync('passwords.txt','utf8').toString().split('\n');

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
        var input = document.createElement("input");

        td1.textContent = allPasswords[i][0];
        input.value = allPasswords[i][1];
        input.type = 'password';
        input.readOnly = true;

        document.getElementById('main-table').appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        td2.appendChild(input);
    }
}
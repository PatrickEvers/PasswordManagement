const fs = require('fs');
const crypto = require('crypto');
const fsasync = fs.promises;

//Klickevent für das Verschlüsseln
document.getElementById('encBtn').addEventListener('click', () =>{
    var usedFor = document.getElementById('used-for').value;
    var password = document.getElementById('password').value;
    var masterPassword = document.getElementById('master-password').value;

    var content = usedFor + ": " + encrypt(masterPassword, password) + "\n";
    fsasync.appendFile('passwords.txt', content, 'utf8');
})

MPwBtn.addEventListener('click', () =>{
    var form = document.getElementById("myForm");
    if (form.style.display === "none") {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
})

//Funktion für die Verschlüsselung
function encrypt (masterPassword, password){
    var key = crypto.createCipher('aes-128-cbc', masterPassword);
    var str = key.update(password, 'utf8', 'hex')
    str += key.final('hex');
    
    return(str);
}

const fs = require('fs');
const crypto = require('crypto');
const fsasync = fs.promises;

document.getElementById('submitBtn').addEventListener('click', () =>{
    var usedFor = document.getElementById('used-for').value;
    var password = document.getElementById('password').value;
    var masterPassword = document.getElementById('master-password').value;
    var content = usedFor + ": " + enc(masterPassword, password) + "\n";
    fsasync.appendFile('passwords.txt', content, 'utf8'); 
    console.log(usedFor+": "+password+"\n"+masterPassword);
})


function enc (masterPassword, password){
    var key = crypto.createCipher('aes-128-cbc', masterPassword);
    var str = key.update(password, 'utf8', 'hex')
    str += key.final('hex');
    
    return(str);
}
const fs = require('fs');

var allPasswords = fs.readFileSync('passwords.txt','utf8').toString().split('\n');
for(var i=0;i<allPasswords.length;i++){
    var li = document.createElement('li');
    li.textContent = allPasswords[i];
    document.getElementById('main-list').appendChild(li);
}
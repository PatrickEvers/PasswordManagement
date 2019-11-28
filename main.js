const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

//Öffne neues BrowserWindow, wenn die App ready ist.
app.on('ready', () => {
    let win = new BrowserWindow({
        width:800,
        heigth:600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol:'file:',
        slashes:true
    }));

    win.on('closed',()=>{
        win=null;
    })
});

//Beende die App, wenn alle Fenster geschlossen sind
app.on('window-all-closed', () =>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});
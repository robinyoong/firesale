const fs = require('fs')

const { app, BrowserWindow, dialog } = require('electron');

// Define the main window outside the function scope so that the browser does not get garbage collected
let mainWindow = null;

// LOADING UP THE MAIN ELECTRON APP
app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // THIS PREVENTS THE WHITE FLASH BEFORE THE APP IS LOADED
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});


// LETS USER PICK A FILE WHEN THEY SELECT THE OPEN FILE BUTTON

exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog({
    properties: ['openFile'],
    buttonLabel: 'Unveil',
    title: 'Open Firesale Doc',

    // Filter the type of files that the user can select
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown']},
      { name: 'Text Files', extensions: ['txt', 'text']},
      { name: 'JSON Files', extensions: ['json']}
    ]
  });

  if (!files) return;

  const file = files[0];
  
    openFile(file)
};

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();

  //We are sending a message. This message needs to be picked up by the renderer via the ipcRenderer.
  mainWindow.webContents.send('file-opened', file, content);
}
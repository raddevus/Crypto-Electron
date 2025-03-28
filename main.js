// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/crypto.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Disable context isolation
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('html-loaded', null);
    console.log("main window is loaded!");
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
let specialFoldersPath = app.getPath('appData');
ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: specialFoldersPath,
    
  }).then((files) =>  {
    if (files) event.sender.send('selected-file', files.filePaths)
  })
})

ipc.on('open-save-dialog', function (event) {
  dialog.showSaveDialog({
    title: "Choose target file",
    defaultPath: specialFoldersPath,
  }).then((data) => {
    if (data.filePath) event.sender.send('saved-file', data.filePath)
  })
})

ipc.on('getPath', (event, arg) => {
  event.reply('getPath-reply', app.getPath(arg));
})

ipc.on('getVersion', (event, arg) => {
  event.reply('getVersion-reply', app.getVersion());
});

ipc.on('getAppPath', (event, args) => {
  event.reply('getAppPath-reply', app.getPath('userData'));
});

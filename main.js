// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');

const { autoUpdater } = require("electron-updater");
autoUpdater.checkForUpdatesAndNotify();

const windowStateKeeper = require('electron-window-state');
let win;

/* function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 150,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      // devTools: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './src/index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here. */

app.on('ready', function () {
  // Load the previous state with fallback to defaults
  const width = 470;
  const height = 110;


  let mainWindowState = windowStateKeeper({
    defaultWidth: 470,
    defaultHeight: 110,
    path: './',
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
 
  // Create the window using the state information
  win = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    // 'width': width,
    // 'height': height,
    width: 470,
    height: 110,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      // devTools: false,
    }
  });
  
  win.setBounds({
    width,
    height,
  })

  win.loadFile(path.join(__dirname, './src/index.html'));
 
  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win);
});


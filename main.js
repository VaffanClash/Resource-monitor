const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const windowStateKeeper = require('electron-window-state');

let mainWindow;
let secondWindow; // New window for the second page

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

  // Create the main window using the state information
  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    width: 470,
    height: 110,
    transparent: true,
    frame: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.setBounds({
    width,
    height,
  })

  mainWindow.loadFile(path.join(__dirname, './src/index.html'));

  ipcMain.on('openSecondWindow', () => {
    console.log('openSecondWindow message received');
    const secondWindow = new BrowserWindow({
      width: 700,
      height: 500,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },

      useContentSize: true,
      resizable: false,

      // frame: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#2f3241',
        symbolColor: '#74b1be',
        height: 60
      }
    });

  ipcMain.on('updateSettings', () => {
    console.log('updateSettings message received');

    mainWindow.webContents.send('updateSettings');
  })

    // secondWindow.loadFile(path.join(__dirname, './src/settings/index.html'));
    secondWindow.loadFile(path.join(__dirname, './src/settings/index.html'));
  });
});

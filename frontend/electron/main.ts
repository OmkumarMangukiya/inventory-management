import { app, BrowserWindow, Menu, shell } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = join(__dirname, '../dist-electron');
export const RENDERER_DIST = join(__dirname, '../dist');

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: join(RENDERER_DIST, 'electron-vite.svg'),
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
      
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  // Load the initial page
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(RENDERER_DIST, 'index.html'));
  }

  // Create the application menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// Function to reload the current window
function refreshApp() {
  if (win && VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  }
}

// Function to navigate to the previous page
function goBack() {
  if (win && win.webContents.canGoBack()) {
    win.webContents.goBack();
  }
}

// Function to navigate to the next page
function goForward() {
  if (win && win.webContents.canGoForward()) {
    win.webContents.goForward();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Menu template with refresh, forward, and backward options in the view menu
const menuTemplate: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'View',
    submenu: [
      {
        label: 'Refresh',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          refreshApp();
        }
      },
      {
        label: 'Backward',
        accelerator: 'CmdOrCtrl+Left',
        click: () => {
          goBack();
        }
      },
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+Right',
        click: () => {
          goForward();
        }
      },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          // const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        }
      }
    ]
  }
];

export { refreshApp, goBack, goForward };
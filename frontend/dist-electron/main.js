import { app, BrowserWindow, Menu, shell } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = join(__dirname, "../dist-electron");
const RENDERER_DIST = join(__dirname, "../dist");
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: join(RENDERER_DIST, "electron-vite.svg"),
    webPreferences: {
      preload: join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(RENDERER_DIST, "index.html"));
  }
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
function refreshApp() {
  if (win && VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  }
}
function goBack() {
  if (win && win.webContents.canGoBack()) {
    win.webContents.goBack();
  }
}
function goForward() {
  if (win && win.webContents.canGoForward()) {
    win.webContents.goForward();
  }
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
const menuTemplate = [
  {
    label: "View",
    submenu: [
      {
        label: "Refresh",
        accelerator: "CmdOrCtrl+R",
        click: () => {
          refreshApp();
        }
      },
      {
        label: "Backward",
        accelerator: "CmdOrCtrl+Left",
        click: () => {
          goBack();
        }
      },
      {
        label: "Forward",
        accelerator: "CmdOrCtrl+Right",
        click: () => {
          goForward();
        }
      },
      { type: "separator" },
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      { role: "close" }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          await shell.openExternal("https://electronjs.org");
        }
      }
    ]
  }
];
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL,
  goBack,
  goForward,
  refreshApp
};

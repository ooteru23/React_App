const { app, BrowserWindow, dialog } = require("electron");
const path = require("node:path");

const { createSequelize } = require("../shared/db");
const { initModels } = require("../models");
const { registerIpc } = require("./ipc");

const isDev = process.env.VITE_DEV === "true";
let db, win;

async function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "bonus.db");
  const sequelize = createSequelize(dbPath);
  db = initModels(sequelize);
  await db.sequelize.sync();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "Bonus Calculation App",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Helpful diagnostics in production builds
  win.webContents.on("did-fail-load", (_e, errorCode, errorDesc, validatedURL) => {
    const msg = `Load failed (${errorCode}): ${errorDesc}\nURL: ${validatedURL}`;
    console.error(msg);
    dialog.showErrorBox("Failed to load UI", msg);
  });

  win.webContents.on("render-process-gone", (_e, details) => {
    console.error("Renderer crashed:", details);
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
    if (process.env.DEBUG_PROD === "true") {
      win.webContents.openDevTools();
    }
  }
}

app.whenReady().then(async () => {
  await initDatabase();
  registerIpc(db);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

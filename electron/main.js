const { app, BrowserWindow } = require("electron");
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

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
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

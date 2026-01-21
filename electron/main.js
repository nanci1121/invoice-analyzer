const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

let mainWindow;

function createWindow() {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handlers
ipcMain.handle('db:get-invoices', async () => {
  return db.getInvoices();
});

ipcMain.handle('db:add-invoice', async (event, invoice) => {
  return db.addInvoice(invoice);
});

ipcMain.handle('db:delete-invoice', async (event, id) => {
  db.deleteInvoice(id);
  return { success: true };
});

app.whenReady().then(async () => {
  await db.initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

import { app, BrowserWindow, ipcMain, Tray, screen } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { chat } from './backend/chat/chat';

const iconPath = path.join(__dirname, 'assets', 'IconTemplate.png');

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let appQuitting = false;

const createTray = () => {
  tray = new Tray(iconPath);

  if (!tray || !mainWindow) return;

  tray.setToolTip('TrayAI');

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      const trayBounds = tray.getBounds();
      const windowBounds = mainWindow.getBounds();

      const x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
      );
      let y = Math.round(trayBounds.y + trayBounds.height);

      if (process.platform === 'win32') {
        const screenHeight = screen.getPrimaryDisplay().bounds.height;
        if (trayBounds.y < screenHeight / 2) {
          // Tray at top
          y = Math.round(trayBounds.y + trayBounds.height);
        } else {
          // Tray at bottom
          y = Math.round(trayBounds.y - windowBounds.height);
        }
      }

      mainWindow.setPosition(x, y, true);
      mainWindow.show();
      mainWindow.focus();
    }
  });
};

if (started) {
  app.quit();
}

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  mainWindow.on('close', (event: Electron.Event) => {
    if (appQuitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
};

app.on('ready', () => {
  createWindow();
  createTray();

  if (process.platform === 'darwin') {
    app.dock.hide();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('quit-app', () => {
  appQuitting = true;
  app.quit();
});

ipcMain.handle('stream-chat', async (event, prompt: string) => {
  const webContents = event.sender;

  for await (const chunk of chat(prompt)) {
    webContents.send('chat-stream-chunk', chunk);
  }
  webContents.send('chat-stream-end');
});

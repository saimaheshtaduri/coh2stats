import { app, BrowserWindow } from 'electron';
import { ApplicationStore } from './electronStore';
import { GameWatcher } from './gameWatcher';
import { ApplicationManager } from './applicationManager';

// manages file and runtime (redux) storage for main
const applicationStore = new ApplicationStore();

let logFileWatcher: GameWatcher;
let applicationManager: ApplicationManager;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  applicationStore.initializeRuntimeStore();
  logFileWatcher = new GameWatcher(applicationStore);
  applicationManager = new ApplicationManager(applicationStore);
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    // not meant for OS X anyways
    //openMatchWindow();
  }
});

app.on("quit", () => {
  console.log("App is quiting");
  applicationManager.destroy();
  logFileWatcher.destroy();
  applicationStore.destroy();
});

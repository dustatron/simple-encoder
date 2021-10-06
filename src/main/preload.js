// import path from 'path';
// import FfmpegCommand from 'fluent-ffmpeg';
// import { removeFileExtension, getPresetNumber } from '../renderer/utils';
const { contextBridge, ipcRenderer, remote } = require('electron');
// const path = require('path');
// const { removeFileExtension } = require('../renderer/utils');

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder', true),
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ['toMain', 'run', 'selectFolder', 'makeProRes', 'os'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    send: (channel, data) => {
      // whitelist channels
      const validChannels = ['toMain', 'run', 'selectFolder', 'os'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    getFolder() {
      return new Promise((resolve, reject) => {
        const result = remote.dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory'],
        });

        result
          .then((results) => {
            return resolve(results);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});

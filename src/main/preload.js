const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // selectFolderPopup: () => ipcRenderer.invoke('select-folder-popup', true),
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
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

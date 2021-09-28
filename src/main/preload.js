import path from 'path';
import FfmpegCommand from 'fluent-ffmpeg';
import { removeFileExtension, getPresetNumber } from '../renderer/utils';

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
    makeProRes: (filePath, fileName, toPath, preset, index, makeUpdate) => {
      const cleanName = removeFileExtension(fileName);
      const promise = new Promise((resolve, reject) => {
        FfmpegCommand(filePath)
          .videoCodec('prores_ks')
          .audioCodec('pcm_s16le')
          .outputOptions([
            `-profile:v ${getPresetNumber(preset)}`,
            '-qscale:v 9',
            '-vendor ap10',
            '-pix_fmt yuv422p10le',
          ])
          .on('start', function () {
            const update = {
              progress: undefined,
              hasEnded: false,
              errorMessage: '',
              hasStarted: true,
              isComplete: false,
            };
            makeUpdate(index, update);
          })
          .on('progress', function (info) {
            const update = {
              progress: info.percent,
              hasEnded: false,
              errorMessage: '',
              hasStarted: true,
              isComplete: false,
            };
            makeUpdate(index, update);
          })
          .on('end', function () {
            const update = {
              progress: undefined,
              hasEnded: true,
              errorMessage: '',
              hasStarted: true,
              isComplete: true,
            };
            makeUpdate(index, update);
            resolve();
          })
          .on('error', function (err) {
            const message = `error : ${err.message}`;
            const update = {
              progress: undefined,
              hasEnded: false,
              errorMessage: message,
              hasStarted: true,
              isComplete: false,
            };
            makeUpdate(index, update);
            return reject(new Error(err));
          })
          .save(path.join(toPath, `${cleanName}.mov`));
      });
      return promise;
    },
  },
});

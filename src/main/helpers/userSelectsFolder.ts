/* eslint-disable import/prefer-default-export */
import { dialog } from 'electron';

export async function userSelectsFolder() {
  return new Promise((resolve, reject) => {
    const result = dialog.showOpenDialog({
      properties: ['createDirectory', 'openDirectory'],
    });

    result
      .then((folder) => {
        return resolve(folder);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import { dialog } from 'electron';
import path from 'path';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

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

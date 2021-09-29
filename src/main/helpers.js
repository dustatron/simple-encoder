const electron = require('electron').remote;

const { dialog } = electron;

async function userSelectsFolder() {
  console.log('userSelectsFolder');
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

module.exports = {
  userSelectsFolder,
};

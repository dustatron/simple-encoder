/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
// import { URL } from 'url';
import path from 'path';
import FfmpegCommand from 'fluent-ffmpeg';
import {
  removeFileExtension,
  getPresetNumber,
  Update,
} from '../../renderer/utils';
import { ProResProps } from '../types';

export const makeProRes = (
  callback: (index: number, update: Update) => void,
  params: ProResProps
) => {
  const { fileName, filePath, toPath, preset, index, ffmpegPath } = params;
  const cleanName = removeFileExtension(fileName);

  const promise = new Promise((resolve, reject) => {
    FfmpegCommand.setFfmpegPath(ffmpegPath);
    FfmpegCommand(filePath)
      .videoCodec('prores_ks')
      .audioCodec('pcm_s16le')
      .outputOptions([
        `-profile:v ${getPresetNumber(preset)}`,
        '-qscale:v 9',
        '-vendor ap10',
        '-pix_fmt yuv422p10le',
      ])
      .on('start', () => {
        const update = {
          progress: undefined,
          hasEnded: false,
          errorMessage: '',
          hasStarted: true,
          isComplete: false,
        };
        callback(index, update);
      })
      .on('progress', (info) => {
        const update = {
          progress: info.percent,
          hasEnded: false,
          errorMessage: '',
          hasStarted: true,
          isComplete: false,
        };
        callback(index, update);
      })
      .on('end', () => {
        const update = {
          progress: undefined,
          hasEnded: true,
          errorMessage: '',
          hasStarted: true,
          isComplete: true,
        };
        callback(index, update);
        return resolve('complete');
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
        callback(index, update);
        return reject(new Error(err));
      })
      .save(path.join(toPath, `${cleanName}.mov`));
  });
  return promise;
};

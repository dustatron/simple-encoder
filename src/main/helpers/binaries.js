/* eslint-disable import/prefer-default-export */
import path from 'path';
import { app } from 'electron';
import getPlatform from './get-platform';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();
const { isPackaged, getAppPath } = app;

const binariesPath =
  IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), '..', './Resources', './bin')
    : path.join(root, './resources', getPlatform(), './bin');

export const execPath = path.resolve(path.join(binariesPath, './ffmpeg'));

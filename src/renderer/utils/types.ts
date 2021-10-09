/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-unused-vars */

import { Dispatch } from 'react';

export enum ProRes {
  PROXY = 'ProPres Proxy',
  LT = 'ProPres LT',
  STANDARD = 'PropRes 422',
  HQ = 'ProRes HQ',
  Quad4 = 'ProRes 4444',
}

export interface Update {
  progress?: number;
  hasEnded: boolean;
  errorMessage: string;
  hasStarted: boolean;
  isComplete: boolean;
}

export enum ActionsFiles {
  AddFiles = 'ADD_FILES',
  ClearAll = 'CLEAR_ALL',
  RemoveItem = 'REMOVE_FILE',
  UpdateItem = 'UPDATE_ITEM',
}
export interface ConvertStatus {
  progress?: number;
  hasEnded: boolean;
  isComplete: boolean;
  hasStarted: boolean;
  errorMessage: string | null;
  originalItem?: File;
  index: number | null;
}

export interface File {
  lastModified: number;
  lastModifiedDate: Date;
  key: string;
  name: string;
  path: string;
  size: number;
  type: string;
  webkitRelativePath: string;
  status: ConvertStatus;
}

export interface DialogResult {
  canceled: boolean;
  filePaths: string[];
}

export interface Payload {
  index?: number;
  files?: File[];
  item?: File;
  progress?: number;
  hasEnded?: boolean;
  isComplete?: boolean;
  hasStarted?: boolean;
  errorMessage?: string | null;
  fileTypes?: string;
  status?: Update;
}

export type State = File[];

export type Action = {
  type: ActionsFiles;
  payload?: Payload;
};
export interface SettingsHook {
  filesList: State;
  dispatchFileList: Dispatch<Action>;
  toLocation: string;
  setToLocation: (value: string) => void;
  proResFlavor: ProRes;
  setProResFlavor: (flavor: ProRes) => void;
  fileTypes: string;
  setFileTypes: (fileTypes: string) => void;
  alert: string | null;
  setAlert: (alertMessage: string | null) => void;
  success: string | null;
  setSuccess: (successMessage: string | null) => void;
  ffmpegPath: string;
  setFfmpegPath: (path: string) => void;
  os: string;
  setOs: (os: OsOptions) => void;
}

export type Reducer<State, Action> = (state: State, action: Action) => State;

export enum OsOptions {
  AIX = 'aix',
  Darwin = 'darwin',
  FreeBSD = 'freebsd',
  Linux = 'linux',
  OpenBSD = 'openbsd',
  SunOS = 'sunos',
  Win32 = 'win32',
  Custom = 'custom',
  NAN = 'NO OS',
}

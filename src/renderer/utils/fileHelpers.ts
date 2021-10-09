/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProRes, ActionsFiles, ConvertStatus } from '.';
import {
  PROPRES_422,
  PROPRES_HQ,
  PROPRES_4444,
  PROPRES_LT,
  PROPRES_PROXY,
} from './recipes';

export const removeFileExtension = (fileName: string) => {
  if (fileName.length <= 0) {
    return fileName;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = fileName.length; i > 0; i--) {
    if (fileName[i] === '.') {
      return fileName.substring(0, i);
    }
  }
  return fileName;
};

export const getFileExtension = (fileName: string) => {
  if (fileName.length <= 0) {
    return fileName;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = fileName.length; i > 0; i--) {
    if (fileName[i - 1] === '.') {
      return fileName.substring(i, fileName.length).toLocaleLowerCase();
    }
  }
  return fileName;
};

export const cleanExtensionList = (ExtensionList: string) => {
  const list = ExtensionList.toLocaleLowerCase().replace(
    /[^0-9a-z,\s+]*$/g,
    ''
  );
  return list;
};

export const getRecipe = (profile: ProRes) => {
  switch (profile) {
    case ProRes.PROXY:
      return PROPRES_PROXY;
    case ProRes.LT:
      return PROPRES_LT;
    case ProRes.STANDARD:
      return PROPRES_422;
    case ProRes.HQ:
      return PROPRES_HQ;
    case ProRes.Quad4:
      return PROPRES_4444;
    default:
      return PROPRES_422;
  }
};
export const getPresetNumber = (profile: ProRes) => {
  switch (profile) {
    case ProRes.PROXY:
      return 0;
    case ProRes.LT:
      return 1;
    case ProRes.STANDARD:
      return 2;
    case ProRes.HQ:
      return 3;
    case ProRes.Quad4:
      return 4;
    default:
      return 1;
  }
};

export const useMakeUpdate = (dispatchFileList: any) => {
  const makeUpdate = (update: ConvertStatus) => {
    const { progress, hasEnded, errorMessage, hasStarted, isComplete, index } =
      update;
    if (hasStarted && !hasEnded && !isComplete) {
      dispatchFileList({
        type: ActionsFiles.UpdateItem,
        payload: {
          index,
          status: {
            hasStarted: true,
            hasEnded: false,
            isComplete: false,
            progress,
            errorMessage: null,
          },
        },
      });
    }
    if (hasStarted && progress && !isComplete) {
      dispatchFileList({
        type: ActionsFiles.UpdateItem,
        payload: {
          index,
          status: {
            hasStarted: true,
            hasEnded: false,
            isComplete: false,
            progress,
            errorMessage: null,
          },
        },
      });
    }

    if (isComplete) {
      dispatchFileList({
        type: ActionsFiles.UpdateItem,
        payload: {
          index,
          status: {
            hasStarted: true,
            hasEnded: true,
            isComplete: true,
            progress: 0,
            errorMessage: null,
          },
        },
      });
    }

    if (errorMessage) {
      dispatchFileList({
        type: ActionsFiles.UpdateItem,
        payload: {
          index,
          status: {
            hasStarted: true,
            hasEnded: true,
            isComplete: false,
            progress: 0,
            errorMessage,
          },
        },
      });
    }
  };
  return makeUpdate;
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import {
  ActionsFiles,
  State,
  Action,
  Reducer,
  File,
  getFileExtension,
} from './index';

const filesReducer: Reducer<State, Action> = (state: State, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionsFiles.AddFiles:
      const formatFiles = payload!
        .files!.filter((file) => {
          const extension = getFileExtension(file.path);
          const acceptedFileTypes = payload!
            .fileTypes!.replace(/\s+/g, '')
            .split(',');
          if (extension && acceptedFileTypes.includes(extension)) {
            return true;
          }
          return false;
        })
        .map((file): File => {
          return {
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            path: file.path,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath,
            status: {
              errorMessage: null,
              hasEnded: false,
              hasStarted: false,
              isComplete: false,
              progress: 0,
              index: null,
            },
          };
        });
      const updatedState = [...state, ...formatFiles!];
      console.log('formatFiles', updatedState, payload);
      // return [...state, ...formatFiles];
      return updatedState;
    case ActionsFiles.ClearAll:
      return [];
    case ActionsFiles.RemoveItem:
      return state.filter((_, index) => index !== payload!.index!);
    case ActionsFiles.UpdateItem:
      const newState = state.map((item, index) => {
        if (index === payload?.index) {
          return { ...item, status: payload.status };
        }
        return state[index];
      });
      return newState as File[];
    default:
      return state;
  }
};

export default filesReducer;

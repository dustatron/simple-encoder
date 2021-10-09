import React, {
  useContext,
  useState,
  useReducer,
  useEffect,
  createContext,
  ReactElement,
  FC,
  useCallback,
} from 'react';
import { OsOptions } from 'renderer/utils/types';
import {
  State,
  SettingsHook,
  filesReducer,
  ProRes,
  cleanExtensionList,
  DEFAULT_FILE_EXTENSION,
} from '../utils';

const SettingsContext = createContext<SettingsHook>({} as SettingsHook);

export function useSettings() {
  return useContext<SettingsHook>(SettingsContext);
}
const fileState: State = [];
export const SettingsProvider: FC = ({ children }): ReactElement => {
  const [alert, setAlert] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filesList, dispatchFileList] = useReducer(filesReducer, fileState);
  const [toLocation, setToLocation] = useState<string>('');
  const [proResFlavor, setProResFlavor] = useState<ProRes>(ProRes.STANDARD);
  const [fileTypes, updateFileTypes] = useState<string>(DEFAULT_FILE_EXTENSION);
  const [ffmpegPath, setFfmpegPath] = useState<string>('/usr/bin/ffmpeg');
  const [os, setOs] = useState<OsOptions>(OsOptions.NAN);

  const setFileTypes = (value: string) => {
    const cleanValue = cleanExtensionList(value);
    updateFileTypes(cleanValue);
  };

  const setLocalStorage = () => {
    localStorage.setItem('simple-encoder-to', toLocation);
    localStorage.setItem('simple-encoder-flavor', proResFlavor);
    localStorage.setItem('simple-encoder-fileTypes', fileTypes);
    localStorage.setItem('simple-encoder-ffmpeg-path', ffmpegPath);
    localStorage.setItem('simple-encoder-os', os);
  };

  const getOsInfoMemo = useCallback(() => {
    window.api.send('get:os');
    window.api.on('reply:get:os', (osValue: string) => {
      setOs(osValue as OsOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const destinationPath = localStorage.getItem('simple-encoder-to');
    const flavor = localStorage.getItem('simple-encoder-flavor') as ProRes;
    const fileExtensions = localStorage.getItem('simple-encoder-fileTypes');
    const ffmpegPathLocal = localStorage.getItem('simple-encoder-ffmpeg-path');
    const savedOS = localStorage.getItem('simple-encoder-os');
    if (destinationPath) {
      setToLocation(destinationPath);
    }
    if (flavor) {
      setProResFlavor(flavor);
    }
    if (fileExtensions) {
      updateFileTypes(fileExtensions);
    }
    if (ffmpegPathLocal) {
      setFfmpegPath(ffmpegPathLocal);
    }
    if (!savedOS || savedOS !== OsOptions.Custom) {
      getOsInfoMemo();
    } else {
      setOs(savedOS as OsOptions);
    }
  }, [getOsInfoMemo]);

  useEffect(() => {
    setLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toLocation, proResFlavor, fileTypes, os, ffmpegPath]);

  useEffect(() => {
    if (os === OsOptions.Darwin) {
      setFfmpegPath('/usr/local/bin/ffmpeg');
    } else if (os === OsOptions.Win32) {
      setFfmpegPath(`C:\\Program Files\\ffmpeg`);
    } else if (os === OsOptions.Linux) {
      setFfmpegPath('/usr/bin/ffmpeg');
    }
  }, [os, setFfmpegPath]);

  const value: SettingsHook = {
    filesList,
    dispatchFileList,
    toLocation,
    setToLocation,
    proResFlavor,
    setProResFlavor,
    fileTypes,
    setFileTypes,
    alert,
    setAlert,
    success,
    setSuccess,
    ffmpegPath,
    setFfmpegPath,
    os,
    setOs,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

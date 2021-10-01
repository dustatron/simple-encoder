import React, {
  useContext,
  useState,
  useReducer,
  useEffect,
  createContext,
  ReactElement,
  FC,
} from 'react';
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
  const [ffmpegPath, setFfmpegPath] = useState<string>('/usr/local/bin/ffmpeg');

  const setFileTypes = (value: string) => {
    const cleanValue = cleanExtensionList(value);
    updateFileTypes(cleanValue);
  };

  const setLocalStorage = () => {
    localStorage.setItem('simple-encoder-to', toLocation);
    localStorage.setItem('simple-encoder-flavor', proResFlavor);
    localStorage.setItem('simple-encoder-fileTypes', fileTypes);
  };

  useEffect(() => {
    const destinationPath = localStorage.getItem('simple-encoder-to');
    const flavor = localStorage.getItem('simple-encoder-flavor') as ProRes;
    const fileExtensions = localStorage.getItem('simple-encoder-fileTypes');
    if (destinationPath) {
      setToLocation(destinationPath);
    }
    if (flavor) {
      setProResFlavor(flavor);
    }
    if (fileExtensions) {
      updateFileTypes(fileExtensions);
    }
  }, []);

  useEffect(() => {
    setLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toLocation, proResFlavor, fileTypes]);

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
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

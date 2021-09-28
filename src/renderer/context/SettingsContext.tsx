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
  const [filesList, dispatchFileList] = useReducer(filesReducer, fileState);
  const [toLocation, setToLocation] = useState<string>('');
  const [proResFlavor, setProResFlavor] = useState<ProRes>(ProRes.STANDARD);
  const [fileTypes, updateFileTypes] = useState<string>(DEFAULT_FILE_EXTENSION);

  const setFileTypes = (value: string) => {
    const cleanValue = cleanExtensionList(value);
    updateFileTypes(cleanValue);
  };

  const setLocalStorage = () => {
    localStorage.setItem('video-converter-to', toLocation);
    localStorage.setItem('video-converter-flavor', proResFlavor);
    localStorage.setItem('video-converter-fileTypes', fileTypes);
  };

  useEffect(() => {
    const destinationPath = localStorage.getItem('video-converter-to');
    const flavor = localStorage.getItem('video-converter-flavor') as ProRes;
    const fileExtensions = localStorage.getItem('video-converter-fileTypes');
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
  }, [toLocation, proResFlavor]);

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
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

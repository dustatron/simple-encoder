import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { useSettings } from '../../context/SettingsContext';

const AlertMessage = () => {
  const { alert, setAlert } = useSettings();
  return (
    <>
      {alert && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{alert}</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => {
              setAlert(null);
            }}
          />
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;

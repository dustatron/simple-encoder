import React from 'react';
import {
  HStack,
  Button,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Box,
} from '@chakra-ui/react';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_FILE_EXTENSION, DialogResult } from '../../utils';

const Settings = () => {
  const { toLocation, setToLocation, fileTypes, setFileTypes } = useSettings();

  const openDialogBox = async () => {
    const folder: DialogResult = await window.api.selectFolder();
    setToLocation(folder.filePaths[0]);
    if (!folder.canceled) {
      setToLocation(folder.filePaths[0]);
    }
  };
  return (
    <Stack spacing="5">
      <FormControl id="Destination" isRequired>
        <FormLabel>Destination</FormLabel>
        <HStack>
          <Input
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />
          <Button onClick={openDialogBox}>Location</Button>
        </HStack>
      </FormControl>
      <FormControl id="file-types">
        <FormLabel>File Type Filter</FormLabel>
        <Input
          value={fileTypes}
          onChange={(e) => setFileTypes(e.target.value)}
        />
        <Text fontSize="sm" color="gray.500" margin="0.5em 0">
          comma separated list of file extensions you want to accept{' '}
        </Text>
        <Button
          onClick={() => {
            setFileTypes(DEFAULT_FILE_EXTENSION);
          }}
        >
          Restore defaults
        </Button>
      </FormControl>
      <Box>
        <Text fontSize="lg">Basic Details</Text>
        <Text as="p" fontSize="sm" color="gray.500">
          This tool will match the frame rate and resolution of the source file.
        </Text>
      </Box>
    </Stack>
  );
};

export default Settings;

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
  const { api } = window;
  const { toLocation, setToLocation, fileTypes, setFileTypes } = useSettings();

  const openDialogBox = async () => {
    api.send('select:folder');
    api.on('reply:selected:folder', (folder: DialogResult) => {
      if (folder && !folder.canceled) {
        setToLocation(folder.filePaths[0]);
      }
    });
  };

  return (
    <Stack spacing="8">
      <FormControl id="Destination" isRequired>
        <FormLabel>Destination Folder</FormLabel>
        <HStack>
          <Input
            w="80%"
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />
          <Box w="5.5em">
            <Button w="100%" onClick={openDialogBox}>
              Folder
            </Button>
          </Box>
        </HStack>
      </FormControl>
      <Box>
        <Stack direction="row">
          <FormControl id="file-types" w="80%">
            <FormLabel>File Extension Filter</FormLabel>
            <Input
              value={fileTypes}
              onChange={(e) => setFileTypes(e.target.value)}
            />
          </FormControl>
          <Box w="5.5em">
            <Button
              w="100%"
              marginTop="8"
              onClick={() => {
                setFileTypes(DEFAULT_FILE_EXTENSION);
              }}
            >
              defaults
            </Button>
          </Box>
        </Stack>
        <Text fontSize="sm" color="gray.500" margin="0.5em 0">
          Comma separated list of file extensions to accept.
        </Text>
      </Box>
    </Stack>
  );
};

export default Settings;

import React, { useEffect, useState, useCallback } from 'react';
import {
  HStack,
  Button,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Box,
  Select,
} from '@chakra-ui/react';
import { OsOptions } from 'renderer/utils/types';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_FILE_EXTENSION, DialogResult } from '../../utils';

const Settings = () => {
  const { api } = window;
  const [os, setOs] = useState<OsOptions>(OsOptions.Linux);
  const {
    toLocation,
    setToLocation,
    fileTypes,
    setFileTypes,
    ffmpegPath,
    setFfmpegPath,
  } = useSettings();

  const getOsInfoMemo = useCallback(() => {
    api.send('os');
    api.on('replyOs', (osValue: string) => {
      setOs(osValue as OsOptions);
    });
  }, [api]);

  useEffect(() => {
    getOsInfoMemo();
  }, [getOsInfoMemo]);

  useEffect(() => {
    if (os === OsOptions.Darwin) {
      setFfmpegPath('/usr/local/bin/ffmpeg');
    } else if (os === OsOptions.Win32) {
      setFfmpegPath(`C:\\Program Files\\ffmpeg`);
    } else if (os === OsOptions.Linux) {
      setFfmpegPath('/usr/bin/ffmpeg');
    } else if (os === OsOptions.Custom) {
      // Let input override
    } else {
      setFfmpegPath('/usr/bin/ffmpeg');
    }
  }, [os, setFfmpegPath]);

  const openDialogBox = async () => {
    api.send('selectFolder');
    api.on('replySelectedFolder', (folder: DialogResult) => {
      if (folder && !folder.canceled) {
        setToLocation(folder.filePaths[0]);
      }
    });
  };

  return (
    <Stack spacing="10">
      <FormControl id="Destination" isRequired>
        <FormLabel>Destination Folder</FormLabel>
        <HStack>
          <Input
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />
          <Button onClick={openDialogBox}>Location</Button>
        </HStack>
      </FormControl>
      <Stack direction="row">
        <FormControl id="file-types">
          <FormLabel>File Extension Filter</FormLabel>
          <Input
            value={fileTypes}
            onChange={(e) => setFileTypes(e.target.value)}
          />
          <Text fontSize="sm" color="gray.500" margin="0.5em 0">
            Comma separated list of file extensions to accept.
          </Text>
        </FormControl>
        <Box>
          <Button
            marginTop="8"
            onClick={() => {
              setFileTypes(DEFAULT_FILE_EXTENSION);
            }}
          >
            defaults
          </Button>
        </Box>
      </Stack>
      <Stack direction="row">
        <FormControl id="file-types" width={9 / 13}>
          <FormLabel>Path to FFMPEG</FormLabel>
          <Input
            value={ffmpegPath}
            isDisabled={os !== OsOptions.Custom}
            onChange={(e) => setFfmpegPath(e.target.value)}
          />
        </FormControl>
        <Box width={4 / 13}>
          <Select
            marginTop="8"
            value={os}
            onChange={(e) => {
              setOs(e.target.value as OsOptions);
            }}
          >
            <option value={OsOptions.Linux}>Linux</option>
            <option value={OsOptions.Win32}>Windows</option>
            <option value={OsOptions.Darwin}>Mac</option>
            <option value={OsOptions.Custom}>Custom</option>
          </Select>
        </Box>
      </Stack>
      <Box>
        <Text fontSize="lg">Basic Details</Text>
        <Text as="p" fontSize="sm" color="gray.500">
          OS Detected: {os}
        </Text>
      </Box>
    </Stack>
  );
};

export default Settings;

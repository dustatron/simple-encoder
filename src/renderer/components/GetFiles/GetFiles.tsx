/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  ReactElement,
  useCallback,
  ChangeEvent,
  useState,
  useEffect,
} from 'react';
import {
  VStack,
  Stack,
  Box,
  Button,
  Select,
  Text,
  Divider,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { ArrowRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { isEmpty } from 'lodash';
import { useDropzone } from 'react-dropzone';
import {
  File,
  ProRes,
  ActionsFiles,
  useMakeUpdate,
  ConvertStatus,
} from '../../utils';
import { useSettings } from '../../context/SettingsContext';
import ListItem from '../ListItem';

interface ProResProps {
  filePath: string;
  fileName: string;
  toPath: string;
  preset: ProRes;
  index: number;
  originalItem: File;
  ffmpegPath: string;
}

export interface Update {
  progress?: number;
  hasEnded: boolean;
  errorMessage: string;
  hasStarted: boolean;
  isComplete: boolean;
}

function GetFiles(): ReactElement {
  const {
    toLocation,
    proResFlavor,
    setProResFlavor,
    dispatchFileList,
    filesList,
    setAlert,
    fileTypes,
    setSuccess,
    ffmpegPath,
  } = useSettings();

  const [status, setState] = useState<ReactElement<any, any>>();
  const [isStartDisabled, setIsStartDisabled] = useState<boolean>(true);

  const makeUpdate = useMakeUpdate(dispatchFileList);

  const badge = (value: string, color: string) => {
    return (
      <Box
        display="inline-block"
        borderRadius="md"
        bg={color}
        color="white"
        padding="1"
        fontSize="xs"
      >
        {value}
      </Box>
    );
  };

  const getStatusBadge = () => {
    const hasStarted =
      filesList.filter((item) => item.status.hasStarted).length > 0;
    const isComplete =
      filesList.filter((item) => item.status.isComplete).length ===
        filesList.length && !isEmpty(filesList);
    const hasError =
      filesList.filter((item) => item.status.errorMessage).length > 0 &&
      !isEmpty(filesList);

    if (hasStarted && !isComplete) {
      return badge('Started', 'orange.500');
    }
    if (!hasStarted && !isComplete && filesList.length > 0) {
      return badge('Ready', 'gray.600');
    }
    if (hasError) {
      return badge('Error', 'red.500');
    }
    if (isComplete) {
      return badge('Done', 'green.600');
    }
    return badge('Add Videos', 'gray.300');
  };

  const getStartStatus = () => {
    const listIsComplete =
      filesList.filter((item) => item.status.isComplete).length ===
      filesList.length;
    const isRunning =
      filesList.filter(
        (item) => item.status.progress && item.status.progress > 0
      ).length > 0;

    if (isRunning) {
      setIsStartDisabled(true);
    }

    if (filesList.length >= 1 && !listIsComplete && !isRunning) {
      setIsStartDisabled(false);
    }

    if (filesList.length === 0) {
      setIsStartDisabled(true);
    }
  };

  useEffect(() => {
    setState(getStatusBadge());
    getStartStatus();
  }, [filesList]);

  const handleProRes = (e: ChangeEvent<HTMLSelectElement>) => {
    const flavor = e.target.value;
    setProResFlavor(flavor as ProRes);
  };

  const processBatch = async () => {
    for (let i = 0; i < filesList.length; i += 1) {
      if (!filesList[i].status.isComplete) {
        const params: ProResProps = {
          fileName: filesList[i].name,
          filePath: filesList[i].path,
          index: i,
          preset: proResFlavor,
          toPath: toLocation,
          originalItem: filesList[i],
          ffmpegPath,
        };
        const runFFMPEG = new Promise((resolve, reject) => {
          window.api.send('makeProRes', params);
          window.api.on('replyMakeProRes', (update: ConvertStatus) => {
            makeUpdate(update);

            if (update.isComplete) {
              resolve('completed');
            }

            if (update.hasEnded) {
              reject(update.hasEnded);
            }
          });
        });
        await runFFMPEG;
      }
    }
  };

  const handleStart = async () => {
    if (toLocation.length <= 0) {
      return setAlert('Please set destination');
    }
    if (filesList.length <= 0) {
      return setAlert('No Files to convert');
    }
    if (filesList.length > 0) {
      await processBatch();
    }
    return setSuccess('Batch has completed');
  };

  const onDropMemo = useCallback(
    (acceptedFile) => {
      dispatchFileList({
        type: ActionsFiles.AddFiles,
        payload: { files: acceptedFile, fileTypes },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filesList]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onDropMemo,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <>
      <VStack spacing={2}>
        <Stack direction="row" width="100%">
          <Text
            fontSize="l"
            fontWeight="semibold"
            width="20%"
            align="center"
            padding="2"
          >
            Presets
          </Text>
          <Select value={proResFlavor} onChange={handleProRes}>
            <option value={ProRes.PROXY}>{ProRes.PROXY}</option>
            <option value={ProRes.LT}>{ProRes.LT}</option>
            <option value={ProRes.STANDARD}>{ProRes.STANDARD}</option>
            <option value={ProRes.HQ}>{ProRes.HQ}</option>
            <option value={ProRes.Quad4}>{ProRes.Quad4}</option>
          </Select>
          <Box>
            <Button
              background="green.500"
              color="white"
              onClick={handleStart}
              rightIcon={<ArrowRightIcon />}
              isDisabled={isStartDisabled}
            >
              Start
            </Button>
          </Box>
        </Stack>
        <Box
          height="7em"
          width="100%"
          border="2px"
          borderStyle="dashed"
          borderRadius="md"
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          bg="gray.100"
          id="From"
          {...getRootProps({ className: 'dropZone' })} // dropzone element
        >
          <input {...getInputProps()} />
          <Button
            margin="auto"
            display="block"
            type="button"
            onClick={open}
            colorScheme="blue"
          >
            Choose files to convert
          </Button>
          {isDragActive ? (
            <Box padding="5" color="gray.500">
              Ready for files...
            </Box>
          ) : (
            <Box padding="2" width="100%" textAlign="center" color="gray.500">
              Or drag and drop there here
            </Box>
          )}
        </Box>
        <Flex width="100%" justifyContent="space-between">
          <Stack
            direction="row"
            spacing="2"
            border="1px"
            borderColor="gray.200"
            padding="2"
            borderRadius="md"
            with="100%"
          >
            <Box>Files: {filesList.length} </Box>
            <Divider orientation="vertical" />
            <Box>Status: {status} </Box>
            <Divider orientation="vertical" />
            <Box>
              completed:{' '}
              {`${
                filesList.filter((item) => item.status.isComplete).length
              } of ${filesList.length}`}{' '}
            </Box>
          </Stack>
          <Button
            onClick={() => {
              dispatchFileList({ type: ActionsFiles.ClearAll });
            }}
          >
            <Icon as={DeleteIcon} />
          </Button>
        </Flex>
        <Stack direction="column" spacing={3} width="100%">
          {filesList.map((file: File, index: number) => (
            <ListItem
              file={file}
              dispatch={dispatchFileList}
              index={index}
              key={file.path}
            />
          ))}
        </Stack>
      </VStack>
    </>
  );
}

export default GetFiles;

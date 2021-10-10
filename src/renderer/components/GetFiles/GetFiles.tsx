/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  ReactElement,
  useCallback,
  ChangeEvent,
  useState,
  useEffect,
} from 'react';
import {
  Center,
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
import { SiAddthis } from 'react-icons/si';
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

const { api } = window;

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

  const getStatusBadgeMemo = useCallback(getStatusBadge, [filesList]);
  const getStartStatusMemo = useCallback(getStartStatus, [filesList]);

  useEffect(() => {
    setState(getStatusBadgeMemo());
    getStartStatusMemo();
  }, [filesList, getStartStatusMemo, setState, getStatusBadgeMemo]);

  const handleProRes = (e: ChangeEvent<HTMLSelectElement>) => {
    const flavor = e.target.value;
    setProResFlavor(flavor as ProRes);
  };

  const processBatch = async (
    videoList: File[],
    proResFlavor: ProRes,
    toLocation: string
  ) => {
    for (let i = 0; i < videoList.length; i += 1) {
      if (!videoList[i].status.isComplete) {
        const params: ProResProps = {
          fileName: videoList[i].name,
          filePath: videoList[i].path,
          index: i,
          preset: proResFlavor,
          toPath: toLocation,
          originalItem: videoList[i],
          ffmpegPath,
        };
        const runFFMPEG = new Promise((resolve, reject) => {
          api.send('make:prores', params);
          api.on('reply:make:proRes', (update: ConvertStatus) => {
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
      await processBatch(filesList, proResFlavor, toLocation);
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
    <Stack spacing="0" height="100%">
      <Box
        minH="89vh"
        width="100%"
        // bg="gray.100"
        id="From"
        {...getRootProps({ className: 'dropZone' })} // dropzone element
      >
        <Stack direction="row" width="100%" padding="2">
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

        <input {...getInputProps()} />

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
          <Box>
            <Button
              type="button"
              onClick={open}
              colorScheme="blue"
              marginRight="2"
            >
              <Icon as={SiAddthis} />
            </Button>
            <Button
              onClick={() => {
                dispatchFileList({ type: ActionsFiles.ClearAll });
              }}
            >
              <Icon as={DeleteIcon} />
            </Button>
          </Box>
        </Flex>
        <Box>
          {isDragActive ? (
            <Center
              padding="5"
              left=".3em"
              top="3em"
              border="4px dashed"
              borderColor="gray.500"
              borderRadius="md"
              height="90vh"
              width="98vw"
              opacity="0.8"
              filter="blur 10px"
              color="black"
              bg="gray.400"
              zIndex="500"
              position="absolute"
            >
              <Box alignContent="center">
                <Text
                  as="h3"
                  textAlign="center"
                  fontWeight="extrabold"
                  fontSize="3xl"
                >
                  Dropzone
                </Text>
                <Text
                  textAlign="center"
                  as="h4"
                  fontWeight="bold"
                  fontSize="lg"
                  width="100%"
                  color="gray.700"
                >
                  Add these files
                </Text>
              </Box>
            </Center>
          ) : (
            ''
          )}
        </Box>
        {filesList.length === 0 ? (
          <Center height="30em">
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="gray.600"
              opacity="0.5"
            >
              Drag and Drop Files here
            </Text>
          </Center>
        ) : (
          ''
        )}
        <Stack direction="column" spacing={3} width="100%" marginTop="2">
          {filesList.map((file: File, index: number) => (
            <ListItem
              file={file}
              dispatch={dispatchFileList}
              index={index}
              key={file.key}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

export default GetFiles;

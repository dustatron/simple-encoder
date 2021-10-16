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
import { useDropzone } from 'react-dropzone';
import {
  getStartStatus,
  getStatusBadge,
  processBatch,
  draftProcess,
} from './getHelpers';
import {
  File,
  ProRes,
  ActionsFiles,
  useMakeUpdate,
  ProResOptions,
  ProResObject,
} from '../../utils';
import { useSettings } from '../../context/SettingsContext';
import ListItem from '../ListItem';

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
  } = useSettings();

  const [status, setStatus] = useState<ReactElement<any, any>>();
  const [isStartDisabled, setIsStartDisabled] = useState<boolean>(true);

  const makeUpdate = useMakeUpdate(dispatchFileList);

  useEffect(() => {
    setStatus(getStatusBadge(filesList));
    getStartStatus(filesList, setIsStartDisabled);
  }, [filesList, setStatus]);

  const handleProRes = (e: ChangeEvent<HTMLSelectElement>) => {
    const flavor = e.target.value;
    setProResFlavor(flavor as ProRes);
  };

  const handleStart = async () => {
    if (toLocation.length <= 0) {
      return setAlert('Please set destination');
    }
    if (filesList.length <= 0) {
      return setAlert('No Files to convert');
    }
    if (filesList.length > 0 && !proResFlavor.includes('Draft')) {
      await processBatch(filesList, proResFlavor, toLocation, makeUpdate); // Make ProRes
    }
    if (filesList.length > 0 && proResFlavor.includes('Draft')) {
      await draftProcess(filesList, proResFlavor, toLocation, makeUpdate); // Make h264
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
            {ProResOptions.map((option: ProResObject) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
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

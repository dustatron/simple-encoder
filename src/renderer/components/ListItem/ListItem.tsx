/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Flex,
  Stack,
  Center,
  Box,
  Button,
  Progress,
  Spinner,
  Text,
  Icon,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaTag, FaCheckCircle } from 'react-icons/fa';
import { RiErrorWarningFill } from 'react-icons/ri';
import { IoMdOpen } from 'react-icons/io';
import { File, ActionsFiles, Action } from '../../utils';
import { useSettings } from '../../context/SettingsContext';
import { removeFileExtension } from '../../utils/fileHelpers';

interface Props {
  file: File;
  index: number;
  dispatch: (action: Action) => void;
}

const ListItem = ({ file, index, dispatch }: Props) => {
  const { toLocation } = useSettings();

  const { status } = file;

  const handleOpenSource = () => {
    window.api.send('open:inFolder', file.path);
  };

  const handleOpenCompleted = () => {
    let os;
    window.api.send('get:os');
    window.api.on('reply:get:os', (osValue: string) => {
      os = osValue;
    });
    const destinationProps = [
      toLocation,
      `${removeFileExtension(file.name)}.mov`,
    ];
    const finalPath = destinationProps.join('/');
    window.api.send('open:inFolder', finalPath);
  };
  const getStatusReport = () => {
    const { errorMessage, isComplete, hasEnded, hasStarted } = status;
    if (errorMessage) {
      return errorMessage;
    }
    if (hasStarted && !hasEnded && !isComplete) {
      return 'Converting File';
    }

    if (hasStarted && hasEnded && !isComplete) {
      return 'There was an issue';
    }
    if (isComplete) {
      return 'Finished';
    }
    if (!hasStarted && !hasEnded && !isComplete) {
      return 'Ready';
    }
    return null;
  };
  return (
    <Flex
      border="1px"
      width="100%"
      borderRadius="md"
      justifyContent="space-between"
    >
      <Center width="10%" padding="2">
        {!status.hasStarted && <Icon color="blue.500" w={6} h={6} as={FaTag} />}
        {status.hasStarted && !status.hasEnded && (
          <Spinner color="blue.500" emptyColor="gray.200" thickness="2px" />
        )}
        {status.isComplete && (
          <Icon color="green.500" w={7} h={7} as={FaCheckCircle} />
        )}
        {status.errorMessage && (
          <Icon color="red.500" w={6} h={6} as={RiErrorWarningFill} />
        )}
      </Center>
      <Box padding="2" height="6em" width="100%">
        <Flex justifyContent="space-between" spacing="10">
          <Button
            leftIcon={<Icon as={IoMdOpen} />}
            size="xs"
            onClick={handleOpenSource}
            colorScheme="facebook"
          >
            Source
          </Button>
          {status.isComplete && (
            <Button
              size="xs"
              onClick={handleOpenCompleted}
              leftIcon={<Icon as={IoMdOpen} />}
              colorScheme="twitter"
            >
              Converted
            </Button>
          )}
        </Flex>
        <Text>
          Source: <strong>{file.name}</strong>
        </Text>

        <Box>Status: {getStatusReport()}</Box>
        {!status.isComplete && (
          <Progress hasStripe isAnimated value={status.progress} />
        )}
        {status.isComplete && <Progress value={100} />}
      </Box>
      <Center width="10%">
        <Button
          variant="link"
          padding="2"
          isDisabled={!!status.progress}
          onClick={() => {
            dispatch({ type: ActionsFiles.RemoveItem, payload: { index } });
          }}
        >
          <CloseIcon />
        </Button>
      </Center>
    </Flex>
  );
};

export default ListItem;

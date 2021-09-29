/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Flex,
  Center,
  Box,
  Button,
  Icon,
  Progress,
  Spinner,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaTag, FaCheckCircle } from 'react-icons/fa';
import { RiErrorWarningFill } from 'react-icons/ri';
import { File, ActionsFiles, Action } from '../../utils';

interface Props {
  file: File;
  index: number;
  dispatch: (action: Action) => void;
}

const ListItem = ({ file, index, dispatch }: Props) => {
  const { status } = file;
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
      <Center width="10%">
        {!status.hasStarted && <Icon color="blue.500" w={6} h={6} as={FaTag} />}
        {status.hasStarted && !status.hasEnded && (
          <Spinner color="blue.500" emptyColor="gray.200" thickness="4px" />
        )}
        {status.isComplete && (
          <Icon color="green.500" w={10} h={10} as={FaCheckCircle} />
        )}
        {status.errorMessage && (
          <Icon color="red.500" w={6} h={6} as={RiErrorWarningFill} />
        )}
      </Center>
      <Box padding="2" height="6em" width="100%">
        Source: <strong>{file.name}</strong>
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

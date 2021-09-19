import React, { ReactElement, useCallback, useState } from 'react';
import {
  Container,
  VStack,
  HStack,
  Box,
  Button,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import ProRes from '../../utils';

// interface Props {}
interface File {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  path: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

function Home(): ReactElement {
  const [fileList, setFileList] = useState<File[]>([]);
  const [toLocation, setToLocation] = useState<string>(
    '/Users/dusty/Desktop/test/'
  );
  const [proResFlavor, setProResFlavor] = useState<ProRes>(ProRes.STANDARD);

  const handleProRes = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const flavor = e.target.value;
    setProResFlavor(flavor as ProRes);
  };

  const onDropMemo = useCallback(
    (acceptedFile) => {
      setFileList([...fileList, ...acceptedFile]);
      console.log(fileList);
    },
    [fileList]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onDropMemo,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Container>
      <VStack spacing={6} marginTop={5}>
        <Box
          height="8em"
          width="100%"
          border="2px"
          borderRadius="md"
          bg="gray.100"
          id="From"
          {...getRootProps({ refKey: 'initialFile' })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Box padding="5" color="gray.500">
              Drop the files here ...
            </Box>
          ) : (
            <Box padding="5" color="gray.500">
              Drag and drop some files here, or click to select files
            </Box>
          )}
          <Button
            margin="auto"
            display="block"
            type="button"
            onClick={open}
            colorScheme="blue"
          >
            Open File Dialog
          </Button>
        </Box>
        <VStack spacing={3}>
          {fileList.map((file: File) => (
            <Box border="1px" key={file.path}>
              <Box>File:{file.name}</Box>
              <Box>Path:{file.path}</Box>
              <Box>Type:{file.type}</Box>
              <Box>Size:{file.size}</Box>
            </Box>
          ))}
        </VStack>
        <HStack>
          <Input
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />
          <Button>Location</Button>
        </HStack>
        <VStack>
          <Text fontSize="xl" fontWeight="bold">
            ProRes Flavor
          </Text>
          <Select value={proResFlavor} onChange={handleProRes}>
            <option value={ProRes.PROXY}>{ProRes.PROXY}</option>
            <option value={ProRes.LT}>{ProRes.LT}</option>
            <option value={ProRes.STANDARD}>{ProRes.STANDARD}</option>
            <option value={ProRes.HQ}>{ProRes.HQ}</option>
            <option value={ProRes.Quad4}>{ProRes.Quad4}</option>
          </Select>
        </VStack>
        <Box>
          <Button colorScheme="facebook">Run</Button>
        </Box>
      </VStack>
    </Container>
  );
}

export default Home;

/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  ProRes,
  ProResProps,
  State,
  File,
  ConvertStatus,
} from 'renderer/utils';
import { isEmpty } from 'lodash';
import { Box } from '@chakra-ui/react';

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

export const getStatusBadge = (filesList: State) => {
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

export const getStartStatus = (
  filesList: State,
  setIsStartDisabled: (status: boolean) => void
) => {
  const listIsComplete =
    filesList.filter((item) => item.status.isComplete).length ===
    filesList.length;
  const isRunning =
    filesList.filter((item) => item.status.progress && item.status.progress > 0)
      .length > 0;

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

export const processBatch = async (
  videoList: File[],
  proResFlavor: ProRes,
  toLocation: string,
  makeUpdate: (update: ConvertStatus) => void
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
      };
      const runFFMPEG = new Promise((resolve, reject) => {
        window.api.send('make:prores', params);
        window.api.on('reply:make:proRes', (update: ConvertStatus) => {
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

export const draftProcess = async (
  draftList: File[],
  draftFlavor: ProRes,
  toLocation: string,
  makeUpdate: (update: ConvertStatus) => void
) => {
  for (let j = 0; j < draftList.length; j += 1) {
    const draftParams: ProResProps = {
      fileName: draftList[j].name,
      filePath: draftList[j].path,
      index: j,
      preset: draftFlavor,
      toPath: toLocation,
      originalItem: draftList[j],
    };
    const runFFMPEG = new Promise((resolve, reject) => {
      window.api.send('make:draft', draftParams);
      window.api.on('reply:make:draft', (update: ConvertStatus) => {
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
};

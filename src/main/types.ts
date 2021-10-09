import { ProRes } from '../renderer/utils';

export interface UpdateVideoInfo {
  progress?: number;
  hasEnded: boolean;
  errorMessage: string;
  hasStarted: boolean;
  isComplete: boolean;
}

export interface ProResProps {
  filePath: string;
  fileName: string;
  toPath: string;
  preset: ProRes;
  index: number;
  ffmpegPath: string;
}

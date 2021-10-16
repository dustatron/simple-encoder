import { platform } from 'os';

export default () => {
  const os = platform();
  switch (os) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux';
    case 'darwin':
      return 'mac';
    case 'sunos':
      return 'mac';
    case 'win32':
      return 'win';
    default:
      return 'linux';
  }
};

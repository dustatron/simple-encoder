import Ffmpeg from 'fluent-ffmpeg';
import ProRes from './types';

const processFile = (from: string, to: string, preset: ProRes) =>
  Ffmpeg(from)
    // use the 'podcast' preset (located in /lib/presets/podcast.js)
    .preset('../../presents/proRes422')
    // in case you want to override the preset's setting, just keep chaining
    .videoBitrate('512k')
    // setup event handlers
    .on('end', () => {
      console.log('file has been converted successfully');
    })
    .on('error', (err) => {
      console.log(`an error happened: ${err.message}`);
    })
    // save to file
    .save(to);

const getPreset = (preset: ProRes) => {
  switch (preset) {
    case ProRes.LT:
      return '../../presents/proRes422';
    case ProRes.STANDARD:
      return '../../presents/proRes422';
    case ProRes.HQ:
      return '../../presents/proRes422';
    case ProRes.Quad4:
      return '../../presents/proRes422';
    default:
      return ProRes.STANDARD;
  }
};

export default processFile;

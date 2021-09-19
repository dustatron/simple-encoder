import { FfmpegCommand } from 'fluent-ffmpeg';

// "' -vcodec prores_ks -profile:v 1 -qscale:v 9 -vendor ap10 -pix_fmt yuv422p10le -acodec pcm_s16le '"

exports.load = (ffmpeg: FfmpegCommand) => {
  ffmpeg
    .format('mov')
    .videoCodec('prores_ks')
    .keepPixelAspect()
    .audioCodec('pcm_s16le')
    .outputOptions([
      '-profile:v 1',
      '-qscale:v 9',
      '-vendor ap10',
      '-pix_fmt yuv422p10le',
    ]);
};

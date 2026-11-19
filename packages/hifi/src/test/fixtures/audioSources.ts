import { AudioSource } from '../../types';

export const MP3_SOURCE: AudioSource = { url: '/a.mp3', protocol: 'http' };

export const FLAC_SOURCE_A: AudioSource = {
  url: '/a.flac',
  protocol: 'http',
  mimeType: 'audio/flac',
};

export const FLAC_SOURCE_B: AudioSource = {
  url: '/b.flac',
  protocol: 'http',
  mimeType: 'audio/flac',
};

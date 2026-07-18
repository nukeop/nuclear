import { Fmp4TrackBuilder } from '../builders/Fmp4TrackBuilder';

export const MSE_URL = 'http://127.0.0.1:3000/stream/test';

export const DEFAULT_TRACK = new Fmp4TrackBuilder()
  .withTimescale(44100)
  .withSegment(50000, 60)
  .withSegment(60000, 60)
  .withSegment(45000, 60)
  .build();

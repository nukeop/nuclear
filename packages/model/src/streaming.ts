import type { ProviderRef } from './index';

export type Stream = {
  url: string;
  protocol: 'file' | 'http' | 'https' | 'hls';
  mimeType?: string;
  bitrateKbps?: number;
  codec?: string;
  container?: string;
  qualityLabel?: string;
  durationMs?: number;
  contentLengthBytes?: number;
  source: ProviderRef;
};

export type LocalFileInfo = {
  fileUri: string;
  fileSize?: number;
  format?: string;
  bitrateKbps?: number;
  sampleRateHz?: number;
  channels?: number;
  fingerprint?: string;
  scannedAtIso?: string;
};

export type StreamCandidate = {
  id: string;
  title: string;
  durationMs?: number;
  thumbnail?: string;
  stream?: Stream;
  lastResolvedAtIso?: string;
  failed: boolean;
  source: ProviderRef;
};

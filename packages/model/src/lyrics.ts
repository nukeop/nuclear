import type { ArtistCredit } from './index';

export type LyricsType = 'plain' | 'lineSynced' | 'wordSynced';

export type LyricsQuery = {
  title: string;
  artist?: string;
};

export type LyricsCandidate = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  durationMs?: number;
};

export type LyricsVocalist = {
  id: string;
  name?: string;
  type: 'person' | 'group';
};

export type LyricsMetadata = {
  language?: string;
  credits?: ArtistCredit[];
  copyright?: string;
  sourceUrl?: string;
  vocalists?: LyricsVocalist[];
};

export type LyricsSegment = {
  text: string;
  ruby?: string;
};

export type TimedLyricsSegment = LyricsSegment & {
  startMs: number;
  endMs: number;
};

export type LineAnnotation = {
  type: 'translation' | 'romanization';
  language: string;
  text: string;
};

export type LyricsLine<TSegment> = {
  segments: TSegment[];
  background?: TSegment[];
  vocalistIds?: string[];
  annotations?: LineAnnotation[];
};

export type SyncedLyricsLine<TSegment> = LyricsLine<TSegment> & {
  startMs: number;
  endMs: number;
};

export type LyricsSection<TLine> = {
  label?: string;
  lines: TLine[];
};

export type PlainLyrics = {
  type: 'plain';
  metadata: LyricsMetadata;
  sections: LyricsSection<LyricsLine<LyricsSegment>>[];
};

export type LineSyncedLyrics = {
  type: 'lineSynced';
  metadata: LyricsMetadata;
  sections: LyricsSection<SyncedLyricsLine<LyricsSegment>>[];
};

export type WordSyncedLyrics = {
  type: 'wordSynced';
  metadata: LyricsMetadata;
  sections: LyricsSection<SyncedLyricsLine<TimedLyricsSegment>>[];
};

export type InstrumentalLyrics = {
  type: 'instrumental';
  metadata: LyricsMetadata;
};

export type Lyrics =
  PlainLyrics | LineSyncedLyrics | WordSyncedLyrics | InstrumentalLyrics;

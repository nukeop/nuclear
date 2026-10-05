import isEmpty from 'lodash-es/isEmpty';

import type {
  LineSyncedLyrics,
  LyricsLine,
  LyricsMetadata,
  LyricsSection,
  LyricsSegment,
  LyricsVocalist,
  PlainLyrics,
  SyncedLyricsLine,
  TimedLyricsSegment,
  WordSyncedLyrics,
} from '@nuclearplayer/model';

class LyricsSectionsBuilder<TLine> {
  protected metadata: LyricsMetadata = {};
  protected sections: LyricsSection<TLine>[] = [];

  withSection(label?: string): this {
    this.sections.push({ label, lines: [] });
    return this;
  }

  withCustomLine(line: TLine): this {
    if (isEmpty(this.sections)) {
      this.withSection();
    }
    this.sections[this.sections.length - 1].lines.push(line);
    return this;
  }
}

export class PlainLyricsBuilder extends LyricsSectionsBuilder<
  LyricsLine<LyricsSegment>
> {
  withLine(text: string): this {
    return this.withCustomLine({ segments: [{ text }] });
  }

  withVocalists(...vocalists: LyricsVocalist[]): this {
    this.metadata.vocalists = vocalists;
    return this;
  }

  build(): PlainLyrics {
    return { type: 'plain', metadata: this.metadata, sections: this.sections };
  }
}

export class LineSyncedLyricsBuilder extends LyricsSectionsBuilder<
  SyncedLyricsLine<LyricsSegment>
> {
  withLine(startMs: number, endMs: number, text: string): this {
    return this.withCustomLine({ startMs, endMs, segments: [{ text }] });
  }

  build(): LineSyncedLyrics {
    return {
      type: 'lineSynced',
      metadata: this.metadata,
      sections: this.sections,
    };
  }
}

export class WordSyncedLyricsBuilder extends LyricsSectionsBuilder<
  SyncedLyricsLine<TimedLyricsSegment>
> {
  build(): WordSyncedLyrics {
    return {
      type: 'wordSynced',
      metadata: this.metadata,
      sections: this.sections,
    };
  }
}

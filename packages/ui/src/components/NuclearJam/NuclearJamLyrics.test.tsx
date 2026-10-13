import { render } from '@testing-library/react';

import type {
  InstrumentalLyrics,
  LineSyncedLyrics,
  PlainLyrics,
} from '@nuclearplayer/model';

import { NuclearJamLyrics, NuclearJamLyricsProps } from './NuclearJamLyrics';

const labels = {
  nothingPlayingTitle: 'Nothing playing',
  nothingPlayingSubtitle: 'Play a track to see its lyrics',
  notFoundTitle: 'No lyrics found',
  notFoundSubtitle: 'No lyrics provider has lyrics for this track',
  instrumentalTitle: 'Instrumental',
  instrumentalSubtitle: 'This track has no lyrics',
  errorTitle: 'Could not load lyrics',
  errorSubtitle: 'Check the connection to Nuclear and try again',
  currentLine: 'Current line',
};

const PLAIN_LYRICS: PlainLyrics = {
  type: 'plain',
  metadata: {},
  sections: [
    {
      lines: [
        { segments: [{ text: 'Paper boats in a parking lot' }] },
        { segments: [{ text: 'Sinking slow in the summer heat' }] },
      ],
    },
  ],
};

const LINE_SYNCED_LYRICS: LineSyncedLyrics = {
  type: 'lineSynced',
  metadata: {},
  sections: [
    {
      lines: [
        {
          startMs: 1000,
          endMs: 4000,
          segments: [{ text: 'Neon rain on the overpass' }],
        },
        {
          startMs: 4000,
          endMs: 7000,
          segments: [{ text: 'Counting static in the glass' }],
        },
        {
          startMs: 7000,
          endMs: 10000,
          segments: [{ text: 'Every signal fades too fast' }],
        },
      ],
    },
  ],
};

const INSTRUMENTAL_LYRICS: InstrumentalLyrics = {
  type: 'instrumental',
  metadata: {},
};

const renderLyrics = (props: Partial<NuclearJamLyricsProps> = {}) =>
  render(
    <NuclearJamLyrics
      state={{ status: 'nothingPlaying' }}
      positionMs={0}
      textSize={1}
      onSeek={vi.fn()}
      labels={labels}
      {...props}
    />,
  );

describe('NuclearJamLyrics', () => {
  it('(Snapshot) renders the nothing playing state', () => {
    const { container } = renderLyrics({ state: { status: 'nothingPlaying' } });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the loading state', () => {
    const { container } = renderLyrics({ state: { status: 'loading' } });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the not found state', () => {
    const { container } = renderLyrics({ state: { status: 'notFound' } });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the instrumental state', () => {
    const { container } = renderLyrics({
      state: { status: 'found', lyrics: INSTRUMENTAL_LYRICS },
    });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders plain lyrics', () => {
    const { container } = renderLyrics({
      state: { status: 'found', lyrics: PLAIN_LYRICS },
    });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders synced lyrics', () => {
    const { container } = renderLyrics({
      state: { status: 'found', lyrics: LINE_SYNCED_LYRICS },
      positionMs: 5000,
    });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders synced lyrics with the largest text size', () => {
    const { container } = renderLyrics({
      state: { status: 'found', lyrics: LINE_SYNCED_LYRICS },
      positionMs: 5000,
      textSize: 2,
    });
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the error state', () => {
    const { container } = renderLyrics({ state: { status: 'error' } });
    expect(container).toMatchSnapshot();
  });
});

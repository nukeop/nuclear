import { render } from '@testing-library/react';

import { SyncedLyrics } from '.';

const LABELS = { currentLine: 'Current line' };

describe('SyncedLyrics', () => {
  it('(Snapshot) renders line synced lyrics', () => {
    const { container } = render(
      <SyncedLyrics
        positionMs={5000}
        onSeek={() => {}}
        labels={LABELS}
        lyrics={{
          type: 'lineSynced',
          metadata: {},
          sections: [
            {
              label: 'Verse 1',
              lines: [
                {
                  startMs: 0,
                  endMs: 4000,
                  segments: [{ text: 'Lorem ipsum dolor' }],
                },
                {
                  startMs: 4000,
                  endMs: 8000,
                  segments: [{ text: 'Sit amet' }],
                },
              ],
            },
            {
              label: 'Chorus',
              lines: [
                {
                  startMs: 8000,
                  endMs: 12000,
                  segments: [{ text: 'Consectetur adipiscing' }],
                },
              ],
            },
          ],
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders word synced lyrics', () => {
    const { container } = render(
      <SyncedLyrics
        positionMs={750}
        onSeek={() => {}}
        labels={LABELS}
        lyrics={{
          type: 'wordSynced',
          metadata: {},
          sections: [
            {
              lines: [
                {
                  startMs: 0,
                  endMs: 2000,
                  segments: [
                    { text: 'Lorem ', startMs: 0, endMs: 500 },
                    { text: 'ipsum ', startMs: 500, endMs: 1000 },
                    { text: 'dolor', startMs: 1000, endMs: 2000 },
                  ],
                },
                {
                  startMs: 2000,
                  endMs: 4000,
                  segments: [
                    { text: 'Sit ', startMs: 2000, endMs: 3000 },
                    { text: 'amet', startMs: 3000, endMs: 4000 },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

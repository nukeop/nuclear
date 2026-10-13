import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';

import { LyricsSource, NuclearJam } from '@nuclearplayer/ui';

import { formatOffset, OFFSET_STEP_MS } from './fixtures/jamLyrics';

const meta = {
  title: 'Remote/NuclearJam/LyricsToolbar',
  component: NuclearJam.LyricsToolbar,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.LyricsToolbar>;

export default meta;

const SOURCES: LyricsSource[] = [
  { id: 'synced', name: 'Synced Lyrics', type: 'lineSynced' },
  { id: 'words', name: 'Word Lyrics', type: 'wordSynced' },
  { id: 'plain', name: 'Plain Lyrics', type: 'plain' },
];

export const Default = {
  render: () => {
    const [selectedSourceId, setSelectedSourceId] = useState('synced');
    const [offsetMs, setOffsetMs] = useState(0);

    return (
      <div className="surface-background w-96">
        <NuclearJam.LyricsToolbar
          sources={SOURCES}
          selectedSourceId={selectedSourceId}
          onSelectSource={setSelectedSourceId}
          offsetValue={formatOffset(offsetMs)}
          onShowEarlier={() => setOffsetMs(offsetMs - OFFSET_STEP_MS)}
          onShowLater={() => setOffsetMs(offsetMs + OFFSET_STEP_MS)}
          labels={{
            types: {
              wordSynced: 'Word synced',
              lineSynced: 'Line synced',
              plain: 'Plain',
            },
            showEarlier: 'Show lyrics earlier',
            showLater: 'Show lyrics later',
          }}
        />
      </div>
    );
  },
};

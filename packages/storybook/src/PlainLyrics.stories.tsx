import { Meta, StoryObj } from '@storybook/react-vite';

import type {
  LyricsLine,
  LyricsSection,
  LyricsSegment,
  LyricsVocalist,
} from '@nuclearplayer/model';
import { PlainLyrics } from '@nuclearplayer/ui';

const line = (text: string): LyricsLine<LyricsSegment> => ({
  segments: [{ text }],
});

const SECTIONS = [
  {
    label: 'Verse 1',
    lines: [
      line('Lorem ipsum dolor sit amet, consectetur'),
      line('Adipiscing elit sed do eiusmod tempor'),
      line('Incididunt ut labore et dolore magna aliqua'),
      line('Ut enim ad minim veniam, quis nostrud'),
    ],
  },
  {
    label: 'Pre-chorus',
    lines: [
      line('Exercitation ullamco laboris nisi ut aliquip'),
      line('Ex ea commodo consequat duis aute'),
    ],
  },
  {
    label: 'Chorus',
    lines: [
      line('Irure dolor in reprehenderit in voluptate'),
      line('Velit esse cillum dolore eu fugiat'),
      line('Nulla pariatur, excepteur sint occaecat'),
      line('Cupidatat non proident, sunt in culpa'),
    ],
  },
  {
    label: 'Bridge',
    lines: [line('Qui officia deserunt'), line('Mollit anim id est laborum')],
  },
];

const UNLABELED_SECTIONS = SECTIONS.map((section) => ({
  lines: section.lines,
}));

const JAPANESE_SECTIONS: LyricsSection<LyricsLine<LyricsSegment>>[] = [
  {
    label: 'Verse 1',
    lines: [
      {
        segments: [
          { text: '空', ruby: 'そら' },
          { text: 'に' },
          { text: '星', ruby: 'ほし' },
          { text: 'が' },
          { text: '光', ruby: 'ひか' },
          { text: 'る' },
        ],
        annotations: [
          {
            type: 'romanization',
            language: 'ja-Latn',
            text: 'Sora ni hoshi ga hikaru',
          },
          {
            type: 'translation',
            language: 'en',
            text: 'Stars shine in the sky',
          },
        ],
      },
      {
        segments: [
          { text: '風', ruby: 'かぜ' },
          { text: 'の' },
          { text: '中', ruby: 'なか' },
          { text: 'を' },
          { text: '歩', ruby: 'ある' },
          { text: 'く' },
        ],
        annotations: [
          {
            type: 'romanization',
            language: 'ja-Latn',
            text: 'Kaze no naka wo aruku',
          },
          {
            type: 'translation',
            language: 'en',
            text: 'Walking through the wind',
          },
        ],
      },
      {
        segments: [
          { text: '明日', ruby: 'あした' },
          { text: 'また' },
          { text: '会', ruby: 'あ' },
          { text: 'おう' },
        ],
        annotations: [
          {
            type: 'romanization',
            language: 'ja-Latn',
            text: 'Ashita mata aou',
          },
          {
            type: 'translation',
            language: 'en',
            text: "Let's meet again tomorrow",
          },
        ],
      },
    ],
  },
];

const VOCALISTS: LyricsVocalist[] = [
  { id: 'lorem', name: 'Lorem Ipsum', type: 'person' },
  { id: 'dolor', name: 'Dolor Sit', type: 'person' },
];

const DUET_SECTIONS: LyricsSection<LyricsLine<LyricsSegment>>[] = [
  {
    label: 'Verse 1',
    lines: [
      {
        ...line('Lorem ipsum dolor sit amet, consectetur'),
        vocalistIds: ['lorem'],
      },
      {
        ...line('Adipiscing elit sed do eiusmod tempor'),
        vocalistIds: ['lorem'],
      },
    ],
  },
  {
    label: 'Verse 2',
    lines: [
      {
        ...line('Incididunt ut labore et dolore magna aliqua'),
        background: [{ text: 'magna aliqua' }],
        vocalistIds: ['dolor'],
      },
      {
        ...line('Ut enim ad minim veniam, quis nostrud'),
        vocalistIds: ['dolor'],
      },
    ],
  },
  {
    label: 'Chorus',
    lines: [
      {
        ...line('Irure dolor in reprehenderit in voluptate'),
        background: [{ text: 'in voluptate' }],
        vocalistIds: ['lorem', 'dolor'],
      },
      {
        ...line('Velit esse cillum dolore eu fugiat'),
        vocalistIds: ['lorem', 'dolor'],
      },
    ],
  },
];

const meta = {
  title: 'Components/Lyrics/PlainLyrics',
  component: PlainLyrics,
  tags: ['autodocs'],
  render: (args) => (
    <div className="max-w-3xl p-10 text-3xl">
      <PlainLyrics {...args} />
    </div>
  ),
} satisfies Meta<typeof PlainLyrics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { sections: SECTIONS },
};

export const WithoutSectionLabels: Story = {
  args: { sections: UNLABELED_SECTIONS },
};

export const WithFuriganaAndAnnotations: Story = {
  args: { sections: JAPANESE_SECTIONS },
};

export const WithVocalistsAndBackgroundVocals: Story = {
  args: { sections: DUET_SECTIONS, vocalists: VOCALISTS },
};

export const Small: Story = {
  args: { sections: SECTIONS, className: 'text-lg' },
  render: (args) => (
    <div className="max-w-xs p-3">
      <PlainLyrics {...args} />
    </div>
  ),
};

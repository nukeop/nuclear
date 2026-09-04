import { Meta, StoryObj } from '@storybook/react-vite';

import { LogEntry } from '@nuclearplayer/ui';

import {
  allVariantEntries,
  collapsibleEntry,
  longSingleLineEntry,
} from './log-stories.data';

const meta = {
  title: 'Components/LogEntry',
  component: LogEntry,
  tags: ['autodocs'],
} satisfies Meta<typeof LogEntry>;

export default meta;

type Story = StoryObj<typeof LogEntry>;

export const AllVariants: Story = {
  render: () => (
    <div className="surface-background flex flex-col">
      {allVariantEntries.map((entry, index) => (
        <LogEntry
          key={entry.id}
          entry={entry}
          index={index}
          onLevelClick={(level) => console.log('Level clicked:', level)}
          onScopeClick={(scope) => console.log('Scope clicked:', scope)}
        />
      ))}
    </div>
  ),
};

export const LongSingleLineMessage: Story = {
  render: () => (
    <div className="surface-background flex flex-col">
      <LogEntry
        entry={longSingleLineEntry}
        index={0}
        onLevelClick={(level) => console.log('Level clicked:', level)}
        onScopeClick={(scope) => console.log('Scope clicked:', scope)}
      />
    </div>
  ),
};

export const ChevronToggle: Story = {
  render: () => (
    <div className="surface-background flex flex-col">
      <LogEntry
        entry={collapsibleEntry}
        index={0}
        onLevelClick={(level) => console.log('Level clicked:', level)}
        onScopeClick={(scope) => console.log('Scope clicked:', scope)}
      />
      <LogEntry
        entry={longSingleLineEntry}
        index={1}
        onLevelClick={(level) => console.log('Level clicked:', level)}
        onScopeClick={(scope) => console.log('Scope clicked:', scope)}
      />
      <LogEntry
        entry={allVariantEntries[2]}
        index={2}
        onLevelClick={(level) => console.log('Level clicked:', level)}
        onScopeClick={(scope) => console.log('Scope clicked:', scope)}
      />
    </div>
  ),
};

export const HoverActionPanel: Story = {
  render: () => (
    <div className="surface-background flex flex-col">
      <p className="text-foreground/60 px-2 py-4 text-sm">
        Hover over a log entry to see the copy button
      </p>
      {allVariantEntries.slice(0, 3).map((entry, index) => (
        <LogEntry
          key={entry.id}
          entry={entry}
          index={index}
          onLevelClick={(level) => console.log('Level clicked:', level)}
          onScopeClick={(scope) => console.log('Scope clicked:', scope)}
        />
      ))}
    </div>
  ),
};

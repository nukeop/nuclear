import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { EditableText } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/EditableText',
  component: EditableText,
  tags: ['autodocs'],
} satisfies Meta<typeof EditableText>;

export default meta;

type Story = StoryObj<typeof EditableText>;

export const SingleLine: Story = {
  render: () => {
    const [value, setValue] = useState('My Awesome Playlist');

    return (
      <div className="flex max-w-lg flex-col gap-2 p-4">
        <EditableText
          value={value}
          onSave={setValue}
          textClassName="text-3xl font-bold"
          placeholder="Enter playlist name..."
        />
        <p className="text-foreground/60 text-xs">Saved value: {value}</p>
      </div>
    );
  },
};

export const MultiLine: Story = {
  render: () => {
    const [value, setValue] = useState(
      'A collection of my favorite tracks from the 90s.',
    );

    return (
      <div className="flex max-w-lg flex-col gap-2 p-4">
        <EditableText
          value={value}
          variant="textarea"
          onSave={setValue}
          textClassName="text-sm"
          placeholder="Add a description..."
        />
        <p className="text-foreground/60 text-xs">Saved value: {value}</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-lg p-4">
      <EditableText
        value="This cannot be edited"
        onSave={() => {}}
        disabled
        textClassName="text-lg"
      />
    </div>
  ),
};

export const EmptyWithPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="flex max-w-lg flex-col gap-2 p-4">
        <EditableText
          value={value}
          onSave={setValue}
          placeholder="Click to add a name..."
          textClassName="text-xl"
        />
        <p className="text-foreground/60 text-xs">
          Saved value: {value || '(empty)'}
        </p>
      </div>
    );
  },
};

export const WithMaxLength: Story = {
  render: () => {
    const [value, setValue] = useState('Short');

    return (
      <div className="flex max-w-lg flex-col gap-2 p-4">
        <EditableText value={value} onSave={setValue} maxLength={10} />
        <p className="text-foreground/60 text-xs">Saved value: {value}</p>
      </div>
    );
  },
};

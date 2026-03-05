import { Meta, StoryObj } from '@storybook/react-vite';

import { KeyCombo } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/KeyCombo',
  component: KeyCombo,
  tags: ['autodocs'],
  argTypes: {
    shortcut: { control: 'text' },
  },
} satisfies Meta<typeof KeyCombo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { shortcut: 'mod+m' },
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-4">
        <span className="text-foreground w-32 text-sm">Single key</span>
        <KeyCombo shortcut="space" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-foreground w-32 text-sm">Arrow keys</span>
        <KeyCombo shortcut="left" />
        <KeyCombo shortcut="right" />
        <KeyCombo shortcut="up" />
        <KeyCombo shortcut="down" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-foreground w-32 text-sm">Modifier + key</span>
        <KeyCombo shortcut="mod+m" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-foreground w-32 text-sm">Modifier + arrow</span>
        <KeyCombo shortcut="mod+right" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-foreground w-32 text-sm">Multiple modifiers</span>
        <KeyCombo shortcut="ctrl+shift+p" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-foreground w-32 text-sm">Comma key</span>
        <KeyCombo shortcut="mod+," />
      </div>
    </div>
  ),
};

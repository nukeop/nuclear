import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

import { BottomBar, Button } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/BottomBar',
  component: BottomBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BottomBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithText: Story = {
  args: {
    children: <span className="text-foreground">Status: Ready</span>,
  },
};

export const PlayerControls: Story = {
  args: {
    children: (
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="text">
              <Shuffle size={16} />
            </Button>
            <Button size="icon" variant="text">
              <SkipBack size={16} />
            </Button>
            <Button size="icon">
              <Play size={16} />
            </Button>
            <Button size="icon" variant="text">
              <SkipForward size={16} />
            </Button>
            <Button size="icon" variant="text">
              <Repeat size={16} />
            </Button>
          </div>
        </div>

        <div className="mx-8 flex-1">
          <div className="text-center">
            <div className="text-foreground text-sm font-medium">
              Song Title
            </div>
            <div className="text-muted-foreground text-xs">Artist Name</div>
          </div>
          <div className="bg-muted mt-2 h-1 rounded-full">
            <div className="bg-primary h-1 w-1/3 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="text">
            <Volume2 size={16} />
          </Button>
          <div className="bg-muted h-1 w-20 rounded-full">
            <div className="bg-primary h-1 w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>
    ),
  },
};

export const StatusBar: Story = {
  args: {
    children: (
      <div className="flex w-full items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-foreground">♪ 1,247 tracks</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">3.2 GB</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Scanning library...</span>
          <div className="bg-muted h-1 w-32 rounded-full">
            <div className="bg-accent-green h-1 w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    ),
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-accent-purple border-accent-purple',
    children: (
      <div className="font-bold text-white">
        Custom styled bottom bar with purple theme
      </div>
    ),
  },
};

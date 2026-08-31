import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { LogViewer } from '@nuclearplayer/ui';

import {
  clickableChipsLogs,
  generateLogs,
  longMessageLogs,
} from './log-stories.data';

const meta = {
  title: 'Components/LogViewer',
  component: LogViewer,
  tags: ['autodocs'],
} satisfies Meta<typeof LogViewer>;

export default meta;

type Story = StoryObj<typeof LogViewer>;

export const Interactive: Story = {
  render: () => {
    const [logs, setLogs] = useState(() => generateLogs(50));
    const scopes = [...new Set(logs.map((log) => log.source.scope))];

    const handleClear = () => setLogs([]);
    const handleExport = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Exported logs:', logs.length);
    };
    const handleOpenLogFolder = () => {
      console.log('Opening log folder...');
    };

    return (
      <div className="surface-background h-[600px] p-4">
        <LogViewer
          logs={logs}
          scopes={scopes}
          onClear={handleClear}
          onExport={handleExport}
          onOpenLogFolder={handleOpenLogFolder}
        />
      </div>
    );
  },
};

export const ManyLogs: Story = {
  render: () => {
    const [logs] = useState(() => generateLogs(1000));
    const scopes = [...new Set(logs.map((log) => log.source.scope))];

    return (
      <div className="surface-background h-[600px] p-4">
        <LogViewer
          logs={logs}
          scopes={scopes}
          onClear={() => {}}
          onExport={() => {}}
          onOpenLogFolder={() => {}}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="surface-background h-[400px] p-4">
      <LogViewer
        logs={[]}
        scopes={[]}
        onClear={() => {}}
        onExport={() => {}}
        onOpenLogFolder={() => {}}
      />
    </div>
  ),
};

export const LongMessages: Story = {
  render: () => {
    const scopes = [...new Set(longMessageLogs.map((log) => log.source.scope))];

    return (
      <div className="surface-background h-[600px] p-4">
        <LogViewer
          logs={longMessageLogs}
          scopes={scopes}
          onClear={() => {}}
          onExport={() => {}}
          onOpenLogFolder={() => {}}
        />
      </div>
    );
  },
};

export const ClickableChips: Story = {
  render: () => {
    const scopes = [
      ...new Set(clickableChipsLogs.map((log) => log.source.scope)),
    ];

    return (
      <div className="surface-background h-[600px] p-4">
        <LogViewer
          logs={clickableChipsLogs}
          scopes={scopes}
          onClear={() => {}}
          onExport={() => {}}
          onOpenLogFolder={() => {}}
        />
      </div>
    );
  },
};

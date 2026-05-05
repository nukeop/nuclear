import clsx from 'clsx';
import { useState, type FC } from 'react';

import { CopyButton } from './CopyButton';

type Tab = {
  id: string;
  label: string;
  content: string;
};

const tabs: Tab[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    content:
      'claude mcp add nuclear --transport http http://127.0.0.1:8800/mcp',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    content: `{
  "mcp": {
    "nuclear": {
      "type": "remote",
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}`,
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    content: 'codex mcp add nuclear --url http://127.0.0.1:8800/mcp',
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop / Cursor',
    content: `{
  "mcpServers": {
    "nuclear": {
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}`,
  },
];

export const McpShowcase: FC = () => {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <section
      id="mcp"
      className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16"
    >
      <h2 className="font-heading text-3xl font-black tracking-widest uppercase md:text-4xl">
        MCP
      </h2>
      <p className="text-foreground max-w-prose text-center text-base leading-relaxed">
        Nuclear has a built-in{' '}
        <strong className="font-bold">Model Context Protocol</strong> server.
        Connect your AI agent and let it control playback, search for music,
        manage queues and playlists.
      </p>

      <div className="themed-border border-border bg-background-secondary shadow-shadow flex w-full flex-col overflow-hidden rounded-md font-mono">
        <div className="border-border bg-background flex overflow-x-auto border-b-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={clsx(
                  'text-foreground cursor-pointer px-4 py-2 text-xs whitespace-nowrap transition',
                  {
                    'bg-primary font-bold': isActive,
                  },
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-background-secondary relative block p-6">
          <pre className="items-center gap-2 overflow-x-auto rounded bg-transparent px-2 py-1 text-sm leading-relaxed">
            <code className="text-foreground font-mono">
              {activeTab.content}
            </code>
          </pre>
          <CopyButton
            text={activeTab.content}
            className="absolute top-2 right-2"
          >
            Copy
          </CopyButton>
        </div>
      </div>
    </section>
  );
};

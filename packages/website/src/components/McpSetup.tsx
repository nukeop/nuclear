import clsx from 'clsx';
import { useState, type FC } from 'react';

import { CopyButton } from './CopyButton';

type Client = {
  label: string;
  location: string;
  snippet: string;
};

const CLIENTS: Client[] = [
  {
    label: 'Claude Code',
    location: 'Terminal',
    snippet:
      'claude mcp add --transport http nuclear http://127.0.0.1:8800/mcp',
  },
  {
    label: 'OpenCode',
    location: 'opencode.json',
    snippet: `{
  "mcp": {
    "nuclear": {
      "type": "remote",
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}`,
  },
  {
    label: 'Codex CLI',
    location: 'Terminal',
    snippet: 'codex mcp add nuclear --url http://127.0.0.1:8800/mcp',
  },
  {
    label: 'Claude Desktop',
    location: 'claude_desktop_config.json',
    snippet: `{
  "mcpServers": {
    "nuclear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://127.0.0.1:8800/mcp"]
    }
  }
}`,
  },
  {
    label: 'Cursor',
    location: '~/.cursor/mcp.json',
    snippet: `{
  "mcpServers": {
    "nuclear": {
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}`,
  },
];

export const McpSetup: FC = () => {
  const [active, setActive] = useState(CLIENTS[0]);

  return (
    <div className="themed-border border-border bg-foreground text-background shadow-shadow w-full overflow-hidden rounded-md font-mono">
      <div className="grid grid-cols-3 items-center bg-zinc-700 px-4 py-2 text-xs">
        <div className="flex gap-2">
          <span className="bg-accent-red size-3 rounded-full" />
          <span className="bg-accent-yellow size-3 rounded-full" />
          <span className="bg-accent-green size-3 rounded-full" />
        </div>
        <span className="text-center whitespace-nowrap text-zinc-300">
          {active.location}
        </span>
        <CopyButton
          text={active.snippet}
          className="justify-self-end text-zinc-300"
        >
          Copy
        </CopyButton>
      </div>
      <div className="flex overflow-x-auto border-b border-zinc-700 bg-zinc-900 px-2 text-xs">
        {CLIENTS.map((client) => (
          <button
            key={client.label}
            type="button"
            onClick={() => setActive(client)}
            className={clsx(
              'cursor-pointer border-b-2 px-4 py-2 whitespace-nowrap transition-colors',
              client === active && 'border-accent-green text-white',
              client !== active &&
                'border-transparent text-zinc-500 hover:text-zinc-300',
            )}
          >
            {client.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        {active.snippet}
      </pre>
    </div>
  );
};

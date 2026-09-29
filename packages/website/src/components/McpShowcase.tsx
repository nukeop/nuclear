import type { FC } from 'react';

import { McpDemo } from './McpDemo';
import { McpSetup } from './McpSetup';

export const McpShowcase: FC = () => (
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

    <McpDemo />
    <McpSetup />
  </section>
);

import { FC } from 'react';

import { RemoteQueuePanel } from './RemoteQueuePanel';

const RemoteControl: FC = () => (
  <div className="bg-background text-foreground flex min-h-screen flex-col">
    <header className="border-border border-b-(length:--border-width) p-4">
      <h1 className="text-xl font-bold">Nuclear Jam</h1>
    </header>
    <main className="flex-1">
      <RemoteQueuePanel />
    </main>
  </div>
);

export default RemoteControl;

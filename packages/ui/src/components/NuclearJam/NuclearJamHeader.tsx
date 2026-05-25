import { FC } from 'react';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { TopBarLogo } from '../TopBarLogo';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

export type NuclearJamHeaderProps = {
  connectionStatus: ConnectionStatus;
  className?: string;
};

export const CONNECTION_DOT_COLOR: Record<
  ConnectionStatus,
  'green' | 'yellow' | 'red'
> = {
  connected: 'green',
  reconnecting: 'yellow',
  disconnected: 'red',
};

export const NuclearJamHeader: FC<NuclearJamHeaderProps> = ({
  connectionStatus,
  className,
}) => (
  <div
    className={cn(
      'border-border flex shrink-0 items-center justify-between border-b-(length:--border-width) px-4 py-3',
      className,
    )}
  >
    <span className="flex flex-row gap-2">
      <TopBarLogo />
      <h1 className="text-foreground inline text-base font-black tracking-tight uppercase">
        Nuclear{' '}
        <span className="text-primary text-stroke-4 stroke-text-black">
          Jam
        </span>
      </h1>
    </span>
    <Badge
      variant="dot"
      color={CONNECTION_DOT_COLOR[connectionStatus]}
      animated={connectionStatus === 'reconnecting'}
      data-testid="connection-status-dot"
    />
  </div>
);

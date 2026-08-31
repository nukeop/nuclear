import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { PulsingText } from '../PulsingText';
import { TopBarLogo } from '../TopBarLogo';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed';

export type ConnectionStatusLabels = Record<ConnectionStatus, string>;

export type NuclearJamHeaderProps = {
  connectionStatus: ConnectionStatus;
  connectionStatusLabels: ConnectionStatusLabels;
  children?: ReactNode;
  className?: string;
};

const CONNECTION_DOT_COLOR: Record<ConnectionStatus, string> = {
  connecting: 'bg-accent-yellow',
  connected: 'bg-accent-green',
  reconnecting: 'bg-accent-yellow',
  failed: 'bg-accent-red',
};

export const NuclearJamHeader: FC<NuclearJamHeaderProps> = ({
  connectionStatus,
  connectionStatusLabels,
  children,
  className,
}) => (
  <div
    className={cn(
      'border-border flex shrink-0 flex-wrap items-center justify-between gap-x-3 border-b-(length:--border-width)',
      className,
    )}
  >
    <span className="my-3 ml-4 flex shrink-0 flex-row gap-2">
      <TopBarLogo />
      <h1 className="text-foreground inline text-base font-black tracking-tight uppercase">
        Nuclear{' '}
        <PulsingText
          text="Jam"
          className="text-primary text-stroke-4 stroke-text-foreground"
        />
      </h1>
    </span>
    {children && (
      <span className="order-last flex w-full min-w-0 items-stretch self-stretch sm:order-0 sm:w-auto sm:flex-1">
        {children}
      </span>
    )}
    <span
      className="border-border bg-foreground my-3 mr-4 inline-flex shrink-0 items-center gap-1.5 rounded-full border-(length:--border-width) px-2.5 py-0.5"
      data-testid="connection-status-badge"
    >
      <span
        className={cn(
          'size-2 rounded-full',
          CONNECTION_DOT_COLOR[connectionStatus],
          connectionStatus === 'reconnecting' && 'animate-pulse',
        )}
        data-testid="connection-status-dot"
      />
      <span className="text-background text-xs font-semibold">
        {connectionStatusLabels[connectionStatus]}
      </span>
    </span>
  </div>
);

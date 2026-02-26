import { cva } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { ComponentProps, FC, memo } from 'react';

import { useCollapsibleText } from '../../hooks';
import { cn } from '../../utils';
import { CopyButton } from '../CopyButton';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export type LogEntryData = {
  id: string;
  timestamp: Date;
  level: LogLevel;
  target: string;
  source: {
    type: 'core' | 'plugin';
    scope: string;
  };
  message: string;
};

const levelBadgeVariants = cva(
  'inline-flex w-14 items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold uppercase',
  {
    variants: {
      level: {
        error: 'bg-accent-red text-foreground',
        warn: 'bg-accent-yellow text-foreground',
        info: 'bg-accent-cyan text-foreground',
        debug: 'bg-accent-purple text-foreground',
        trace: 'bg-foreground/50 text-background',
      },
    },
  },
);

const levelBorderVariants = cva('border-l-[3px]', {
  variants: {
    level: {
      error: 'border-l-accent-red',
      warn: 'border-l-accent-yellow',
      info: 'border-l-accent-cyan',
      debug: 'border-l-accent-purple',
      trace: 'border-l-foreground/30',
    },
  },
});

const sourceChipVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      type: {
        core: 'bg-foreground/10 text-foreground',
        plugin: 'bg-accent-orange/50 text-foreground',
      },
    },
  },
);

export type LogEntryProps = ComponentProps<'div'> & {
  entry: LogEntryData;
  index?: number;
  onLevelClick: (level: string) => void;
  onScopeClick: (scope: string) => void;
  isScopeClickable?: (scope: string) => boolean;
};

const LogEntryImpl: FC<LogEntryProps> = ({
  entry,
  index,
  onLevelClick,
  onScopeClick,
  isScopeClickable,
  className,
  ...props
}) => {
  const formattedTime = DateTime.fromJSDate(entry.timestamp).toFormat(
    'HH:mm:ss.SSS',
  );

  const displayLabel = entry.source.scope || entry.target;

  const { isCollapsible, displayedText, isExpanded, toggle } =
    useCollapsibleText(entry.message);

  const scopeClickable =
    !isScopeClickable || isScopeClickable(entry.source.scope);

  return (
    <div
      className={cn(
        'group border-border/50 relative grid grid-cols-[auto_auto_auto_auto_1fr] items-start gap-2 border-b px-2 py-2 font-mono text-sm',
        levelBorderVariants({ level: entry.level }),
        index !== undefined && index % 2 === 1 ? 'bg-foreground/[0.03]' : '',
        className,
      )}
      {...props}
    >
      <div className="flex w-4 items-center justify-center pt-0.5">
        {isCollapsible ? (
          <button
            type="button"
            data-testid="log-expand-toggle"
            className={cn(
              'text-foreground/40 hover:text-foreground/60 cursor-pointer transition-transform duration-150',
              isExpanded && 'rotate-90',
            )}
            onClick={toggle}
          >
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <span className="size-4" />
        )}
      </div>
      <span
        data-testid="log-timestamp"
        className="text-foreground/60 whitespace-nowrap"
      >
        {formattedTime}
      </span>
      <button
        type="button"
        data-testid="log-level"
        className={cn(
          levelBadgeVariants({ level: entry.level }),
          'cursor-pointer hover:opacity-80',
        )}
        onClick={() => onLevelClick(entry.level)}
      >
        {entry.level.toUpperCase()}
      </button>
      {displayLabel &&
        (scopeClickable ? (
          <button
            type="button"
            data-testid="log-scope"
            className={cn(
              sourceChipVariants({ type: entry.source.type }),
              'cursor-pointer hover:opacity-80',
            )}
            onClick={() => onScopeClick(entry.source.scope)}
          >
            {displayLabel}
          </button>
        ) : (
          <span
            data-testid="log-scope"
            className={sourceChipVariants({ type: entry.source.type })}
          >
            {displayLabel}
          </span>
        ))}
      <span
        data-testid="log-message"
        className="text-foreground break-all whitespace-pre-wrap"
      >
        {isExpanded ? entry.message : displayedText}
      </span>
      <div
        data-testid="log-action-panel"
        className="absolute top-1 right-2 hidden group-hover:block"
      >
        <CopyButton data-testid="log-copy-button" text={entry.message} />
      </div>
    </div>
  );
};

export const LogEntry = memo(LogEntryImpl);

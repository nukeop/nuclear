import { FC } from 'react';

import { Platform, usePlatform } from '../../providers/PlatformProvider';
import { cn } from '../../utils';

const PLATFORM_KEY_LABELS: Record<string, Record<string, string>> = {
  mac: {
    mod: '⌘',
    meta: '⌘',
    alt: '⌥',
    shift: '⇧',
    backspace: '⌫',
    delete: '⌦',
  },
  default: {
    mod: 'Ctrl',
    meta: 'Win',
    alt: 'Alt',
    shift: 'Shift',
    backspace: 'Backspace',
    delete: 'Del',
  },
};

const COMMON_KEY_LABELS: Record<string, string> = {
  ctrl: 'Ctrl',
  space: 'Space',
  enter: 'Enter',
  tab: 'Tab',
  escape: 'Esc',
  comma: ',',
  period: '.',
  slash: '/',
  backslash: '\\',
  backquote: '`',
  minus: '-',
  equal: '=',
  semicolon: ';',
  quote: "'",
  bracketleft: '[',
  bracketright: ']',
  left: '←',
  right: '→',
  up: '↑',
  down: '↓',
};

const formatKey = (key: string, platform: Platform): string => {
  const lower = key.toLowerCase();
  const platformLabels =
    platform === 'macos'
      ? PLATFORM_KEY_LABELS.mac
      : PLATFORM_KEY_LABELS.default;
  return (
    platformLabels[lower] ??
    COMMON_KEY_LABELS[lower] ??
    (key.length === 1 ? key.toUpperCase() : key)
  );
};

type KeyComboProps = {
  shortcut: string;
  className?: string;
};

export const KeyCombo: FC<KeyComboProps> = ({ shortcut, className }) => {
  const platform = usePlatform();
  const keys = shortcut.split('+').map((key) => formatKey(key, platform));

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          role="kbd"
          className="bg-background-secondary text-foreground border-border shadow-shadow inline-flex min-w-6 items-center justify-center rounded border-(length:--border-width) px-1.5 py-0.5 font-mono text-xs"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
};

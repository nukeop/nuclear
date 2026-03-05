import { FC } from 'react';

import { cn } from '../../utils';
import { isMac } from '../../utils/platform';

const KEY_LABELS: Record<string, string> = {
  mod: isMac() ? '⌘' : 'Ctrl',
  meta: isMac() ? '⌘' : 'Win',
  ctrl: 'Ctrl',
  alt: isMac() ? '⌥' : 'Alt',
  shift: isMac() ? '⇧' : 'Shift',
  space: 'Space',
  enter: 'Enter',
  tab: 'Tab',
  backspace: isMac() ? '⌫' : 'Backspace',
  delete: isMac() ? '⌦' : 'Del',
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

const formatKey = (key: string): string =>
  KEY_LABELS[key.toLowerCase()] ?? (key.length === 1 ? key.toUpperCase() : key);

type KeyComboProps = {
  shortcut: string;
  className?: string;
};

export const KeyCombo: FC<KeyComboProps> = ({ shortcut, className }) => {
  const keys = shortcut.split('+').map(formatKey);

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          role="kbd"
          className="bg-muted text-foreground inline-flex min-w-6 items-center justify-center rounded border border-white/10 px-1.5 py-0.5 font-mono text-xs"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
};

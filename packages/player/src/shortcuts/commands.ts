const isMac = navigator.userAgent.includes('Mac');

export type ShortcutCommand = {
  id: string;
  name: string;
  shortcut: string;
  section: string;
};

export const COMMANDS = {
  toggleSettings: {
    id: 'settings.toggle',
    name: 'Toggle settings',
    shortcut: isMac ? 'meta+comma' : 'ctrl+comma',
    section: 'General',
  },
} as const satisfies Record<string, ShortcutCommand>;

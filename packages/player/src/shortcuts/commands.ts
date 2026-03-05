export type ShortcutCommand = {
  id: string;
  defaultShortcut: string;
  section: string;
};

export const COMMANDS: Record<string, ShortcutCommand> = {
  'playback.toggle': {
    id: 'playback.toggle',
    defaultShortcut: 'space',
    section: 'playback',
  },
  'playback.next': {
    id: 'playback.next',
    defaultShortcut: 'mod+right',
    section: 'playback',
  },
  'playback.previous': {
    id: 'playback.previous',
    defaultShortcut: 'mod+left',
    section: 'playback',
  },
  'playback.seekForward': {
    id: 'playback.seekForward',
    defaultShortcut: 'right',
    section: 'playback',
  },
  'playback.seekBackward': {
    id: 'playback.seekBackward',
    defaultShortcut: 'left',
    section: 'playback',
  },
  'playback.volumeUp': {
    id: 'playback.volumeUp',
    defaultShortcut: 'mod+up',
    section: 'playback',
  },
  'playback.volumeDown': {
    id: 'playback.volumeDown',
    defaultShortcut: 'mod+down',
    section: 'playback',
  },
  'playback.mute': {
    id: 'playback.mute',
    defaultShortcut: 'mod+m',
    section: 'playback',
  },
  'general.toggleSettings': {
    id: 'general.toggleSettings',
    defaultShortcut: 'mod+comma',
    section: 'general',
  },
};

export const SHORTCUT_SECTIONS = ['playback', 'general'] as const;

export const getCommandsBySection = (section: string): ShortcutCommand[] =>
  Object.values(COMMANDS).filter((command) => command.section === section);

import { CommandPalette } from '../lib';
import { CommandPaletteAction } from '../lib/components/CommandPalette';
import { makeSnapshotTest } from './helpers';

const actions: CommandPaletteAction[] = [
  {
    id: 'play',
    name: 'Play',
    shortcut: ['space'],
    icon: 'play',
    category: 'Playback'
  }, {
    id: 'next',
    name: 'Next',
    shortcut: ['right arrow'],
    icon: 'forward',
    category: 'Playback'
  }, {
    id: 'previous',
    name: 'Previous',
    shortcut: ['left arrow'],
    icon: 'backward',
    category: 'Playback'
  }, {
    id: 'shuffle',
    name: 'Shuffle',
    shortcut: [],
    icon: 'random',
    category: 'Playback'
  }, {
    id: 'repeat',
    name: 'Repeat',
    shortcut: [],
    icon: 'repeat',
    category: 'Playback'
  }, {
    id: 'raise-volume',
    name: 'Raise volume',
    shortcut: [],
    icon: 'volume up',
    category: 'Playback'
  }, {
    id: 'lower-volume',
    name: 'Lower volume',
    shortcut: [],
    icon: 'volume down',
    category: 'Playback'
  }
];

makeSnapshotTest(
  CommandPalette,
  { isLoading: true },
  '(Snapshot) Command palette - loading'
);

makeSnapshotTest(
  CommandPalette,
  {
    actions: [],
    protipText: 'PROTIP:',
    protipContent: 'Narrow down the list of commands by typing in the search box.'
  },
  '(Snapshot) Command palette - empty'
);

makeSnapshotTest(
  CommandPalette,
  {
    actions,
    protipText: 'PROTIP:',
    protipContent: 'Use the keyboard to navigate the command palette.'
  },
  '(Snapshot) Command palette - with actions'
);

import React from 'react';

import { CommandPalette } from '../..';
import { CommandPaletteAction } from '../../lib/components/CommandPalette';

export default {
  title: 'Components/Command palette',
  argTypes: {
    onPlay: { action: 'play' },
    onNext: { action: 'next' },
    onPrevious: { action: 'previous' },
    onShuffle: { action: 'shuffle' },
    onRepeat: { action: 'repeat' }
  }
};

const actions = (actions: {
    [key: string]: () => void
}): CommandPaletteAction[] => [
  {
    id: 'play',
    name: 'Play',
    shortcut: ['space'],
    icon: 'play',
    category: 'Playback',
    onUse: actions.onPlay
  }, {
    id: 'next',
    name: 'Next',
    shortcut: ['right arrow'],
    icon: 'forward',
    category: 'Playback',
    onUse: actions.onNext
  }, {
    id: 'previous',
    name: 'Previous',
    shortcut: ['left arrow'],
    icon: 'backward',
    category: 'Playback',
    onUse: actions.onPrevious
  }, {
    id: 'shuffle',
    name: 'Shuffle',
    shortcut: [],
    icon: 'random',
    category: 'Playback',
    onUse: actions.onShuffle
  }, {
    id: 'repeat',
    name: 'Repeat',
    shortcut: [],
    icon: 'repeat',
    category: 'Playback',
    onUse: actions.onRepeat
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

export const Loading = () => (
  <div className='bg'>
    <CommandPalette 
      isLoading 
      emptyStateText='Searching for commands...'
    />
  </div>
);

export const Empty = () => (
  <div className='bg'>
    <CommandPalette
      actions={[]}
      protipText='PROTIP:'
      protipContent='Narrow down the list of commands by typing in the search box.'
      emptyStateText='No commands found.'
    />
  </div>
);

export const WithActions = (callbacks: {
  onPlay,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat
}) => (
  <div className='bg'>
    <CommandPalette
      actions={actions(callbacks)}
      protipText='PROTIP:'
      protipContent='Use the keyboard to navigate the command palette.'
      emptyStateText="Can't find what you're looking for?"
    />
  </div>
);

export const Interactive = (callbacks: {
    onPlay,
    onNext,
    onPrevious,
    onShuffle,
    onRepeat
  }) => {
  const allActions = actions(callbacks);
  const [input, setInput] = React.useState('');

  return  <div className='bg'>
    <CommandPalette
      actions={allActions.filter(action => action.name.toLowerCase().includes(input.toLowerCase()))}
      protipText='PROTIP:'
      protipContent='Use the keyboard to navigate the command palette.'
      inputValue={input}
      onInputChange={text => setInput(text)}
      emptyStateText="Can't find what you're looking for?"
    />
  </div>;
};

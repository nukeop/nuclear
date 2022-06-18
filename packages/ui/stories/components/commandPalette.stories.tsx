import React from 'react';

import { CommandPalette } from '../..';

export default {
  title: 'Components/Command palette'
};

export const Loading = () => (
  <div className='bg'>
    <CommandPalette 
      isLoading 
    />
  </div>
);

export const WithActions = () => (
  <div className='bg'>
    <CommandPalette
      actions={[
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
      ]}
      protipText='PROTIP:'
      protipContent='Use the keyboard to navigate the command palette.'
    />
  </div>
);

import React from 'react';

import { ContextPopup } from '../..';
import { PopupButton } from '../..';

export default {
  title: 'Components/Context popup'
};

export const Basic = () => (
  <div className='bg'>
    <ContextPopup
      trigger={<button>Test</button>}
      artist='Test artist'
      title='Test title'
    >
      <PopupButton
        onClick={() => alert('Button 1 clicked')}
        ariaLabel={'test'}
        icon='hand lizard'
        label={'Test button'}
      />

      <PopupButton
        onClick={() => alert('Button 2 clicked')}
        ariaLabel={'test'}
        icon='meh'
        label={'Another test button'}
      />
    </ContextPopup>
  </div>
);

export const WithCoverArt = () => (
  <div className='bg'>
    <ContextPopup
      trigger={<button>Test</button>}
      artist='Test artist'
      title='Test title'
      thumb='https://i.imgur.com/4euOws2.jpg'
    >
      <PopupButton
        onClick={() => alert('Button 1 clicked')}
        ariaLabel={'test'}
        icon='hand lizard'
        label={'Test button'}
      />

      <PopupButton
        onClick={() => alert('Button 2 clicked')}
        ariaLabel={'test'}
        icon='meh'
        label={'Another test button'}
      />
    </ContextPopup>
  </div>
);

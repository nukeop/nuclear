import React from 'react';
import { render } from '@testing-library/react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { AnyProps, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import PlayerBarContainer from '.';

describe('PlayerBar container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display no time stamp if rendertrackDuration is false', () => {
    const component = mountComponent({
      renderTrackDuration: false
    });

    expect(component.getByText('00:00')).toBeNull;
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const component = render(<TestStoreProvider
      initialState={initialStore ?? { 
        renderTrackDuration: true,
        timePlayed: '-3:14',
        timeToEnd: '2:43',
        fill: 66,
        track: 'Test song',
        artist: 'Test artist',
        cover: 'https://i.imgur.com/4euOws2.jpg',
        volume: 60,
        queue: { queueItems: [] },
        playOptions: [
          { icon: ('repeat' as SemanticICONS), enabled: false, name: 'Repeat' },
          { icon: ('magic' as SemanticICONS), name: 'Autoradio' },
          { icon: ('random' as SemanticICONS), enabled: false, name: 'Shuffle' }
        ],
        isMuted: false
      }
      }
    >
      <PlayerBarContainer />
    </TestStoreProvider>);
    return component;
  };
});

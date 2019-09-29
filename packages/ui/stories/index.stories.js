import React from 'react';
import { storiesOf } from '@storybook/react';

import ui from '../';
import { formatDuration } from '../lib/utils';
import './styles.scss';

storiesOf('Cover', module)
  .add('Basic', () => (
    <ui.Cover cover='https://i.imgur.com/4euOws2.jpg'/>
  ));

storiesOf('Seekbar', module)
  .add('Basic', () => {
    return (
      <div>
        Seekbars filled to various levels.
        <br /><br />
        60%:
        <ui.Seekbar fill='60%' />
        <br />
        70%:
        <ui.Seekbar fill='70%' />
        <br />
        80%:
        <ui.Seekbar fill='80%' />
        <br />
        30%:
        <ui.Seekbar fill='30%' />
        <br />
        10%:
        <ui.Seekbar fill='10%' />
        <br />
      </div>
    );
  });

storiesOf('QueueItem', module)
  .add('Basic', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <ui.QueueItem
          track={{
            thumbnail: 'https://i.imgur.com/4euOws2.jpg',
            name: 'Test track name',
            artist: 'Test artist'
          }}
          isLoading={false}
          isCurrent={false}
          duration={formatDuration(123)}
          defaultMusicSource={{}}
          selectSong={() => {
            alert('Item selected');
          }}
          removeFromQueue={() => {
            alert('Item removed from queue');
          }}
        />
      </div>
    );
  })
  .add('Loading', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <ui.QueueItem
          track={{
            thumbnail: 'https://i.imgur.com/4euOws2.jpg',
            name: 'Test track name',
            artist: 'Test artist'
          }}
          isLoading={true}
          isCurrent={false}
          duration={formatDuration(123)}
          defaultMusicSource={{}}
          selectSong={() => {
            alert('Item selected');
          }}
          removeFromQueue={() => {
            alert('Item removed from queue');
          }}
        />
      </div>
    );
  })
  .add('Current', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <ui.QueueItem
          track={{
            thumbnail: 'https://i.imgur.com/4euOws2.jpg',
            name: 'Test track name',
            artist: 'Test artist'
          }}
          isLoading={false}
          isCurrent={true}
          duration={formatDuration(123)}
          defaultMusicSource={{}}
          selectSong={() => {
            alert('Item selected');
          }}
          removeFromQueue={() => {
            alert('Item removed from queue');
          }}
        />
      </div>
    );
  });


storiesOf('Loader', module)
  .add('Default', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        width: '100%',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <ui.Loader />
      </div>
    );
  })
  .add('Circle', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        width: '100%',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <ui.Loader type='circle'/>
      </div>
    );
  })
  .add('Small', () => {
    return (
      <div style={{
        background: '#282a36',
        height: '100%',
        width: '100%',
        padding: '1em',
        boxSizing: 'border-box'
      }}>
        <ui.Loader type='small'/>
      </div>
    );
  });

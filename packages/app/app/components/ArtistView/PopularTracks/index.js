import React from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import { withTranslation } from 'react-i18next';

import TrackRow from '../../TrackRow';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';

@withTranslation('artist')
class PopularTracks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  toggleExpand () {
    this.setState(prevState => {
      return { expanded: !prevState.expanded };
    });
  }

  renderAddAllButton (artist, tracks) {
    return (
      <a
        key='add-all-tracks-to-queue'
        href='#'
        onClick={() => {
          _.get(tracks, 'track', [])
            .slice(0, this.state.expanded ? 15 : 5)
            .map(track => {
              this.props.addToQueue(this.props.musicSources, {
                artist: artist.name,
                name: track.name,
                thumbnail: track.thumbnail || track.image[0]['#text'] || artPlaceholder
              });
            });
        }}
        className={styles.add_button}
        aria-label={this.props.t('queue')}
      >
        <FontAwesome name='plus' /> Add all
      </a>
    );
  }

  render () {
    let { artist, tracks, t } = this.props;

    return (
      <div className={cx(
        styles.popular_tracks_container,
        trackRowStyles.tracks_container
      )}>
        <div className={styles.header}>Popular tracks </div>
        {this.renderAddAllButton(artist, tracks)}
        <table>
          <thead>
            <tr>
              <th>
                <FontAwesome name='photo' />
              </th>
              <th>{t('title')}</th>
              <th>{t('count')}</th>
            </tr>
          </thead>
          <tbody>
            {
              _.get(tracks, 'track', [])
              .slice(0, this.state.expanded ? 15 : 5)
              .map((track, index) => {
                return (
                  <TrackRow
                    key={'popular-track-row-' + index}
                    track={track}
                    index={'popular-track-' + index}
                    artist={artist}
                    displayCover
                    displayPlayCount
                  />
                );
              })
            }
          </tbody>
        </table>
        <div className='expand_button' onClick={this.toggleExpand.bind(this)}>
          <FontAwesome
            name={this.state.expanded ? 'angle-double-up' : 'angle-double-down'}
          />
        </div>
      </div>
    );
  }
}

export default PopularTracks;

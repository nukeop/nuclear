import React from 'react';
import { Tab } from 'semantic-ui-react';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import ContextPopup from '../../ContextPopup';
import styles from './styles.scss';

class ChartsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTrackRow(track, i) {
    return (
      <tr key={'toptrack-' + i} className={styles.track}>
        <td>
          <img src={track.image[0]['#text'] || artPlaceholder} />
        </td>
        <td className={styles.popular_track_artist}>{track.artist.name}</td>
        <td className={styles.popular_track_name}>{track.name}</td>
        <td className={styles.playcount}>
          {numeral(track.playcount).format('0,0')}
        </td>
      </tr>
    );
  }

  renderAddTrackToQueueButton(track, i) {
    let { addToQueue, musicSources } = this.props;
    return (
   
        <a
          href='#'
          className='add_button'
          onClick={() => {
            addToQueue(musicSources, {
              artist: track.artist.name,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
          }}
          aria-label='Add track to queue'
        >
        
          <FontAwesome name='plus' /> Add to queue
        </a>
    );
  }

  renderContextPopup (track, i) {
    let { addToQueue, musicSources, clearQueue, selectSong, startPlayback } = this.props;
    return (
      <ContextPopup
        key={'popup-' + i}
        artist={track.artist.name}
        title={track.name}
        thumb={track.image[1]['#text']}
        trigger={this.renderTrackRow(track, i)}
      >
      {this.renderAddTrackToQueueButton(track, i)}
      {this.renderPlayTrackButton(track, i)}
    </ContextPopup>
    );
  }

  renderPlayTrackButton (track, el) {
    return (
      <a
        href='#'
        onClick={() => {
          this.props.clearQueue();
          this.addToQueue(track, el);
          this.props.selectSong(0);
          this.props.startPlayback();
        }}
        aria-label='Play this track now'
        className={styles.add_button}
      >
        <FontAwesome name='play' /> Play now
      </a>
    );
  }


  render() {
    let {album} = this.props;
    return (
      <Tab.Pane attached={false}>
        <div className={styles.popular_tracks_container}>
          <h3>Top Tracks from LastFm.</h3>
          <table>
            <thead>
              <tr>
                <th>
                  <FontAwesome name='photo' />
                </th>
                <th>Artist</th>
                <th>Title</th>
                <th>Playcounts</th>
              </tr>
            </thead>
            <tbody>
              {this.props.topTracks.map((track, i) => {
                return this.renderContextPopup(track, i);
              })}
            </tbody>
          </table>
        </div>
      </Tab.Pane>
    );
  }
}

export default ChartsTab;

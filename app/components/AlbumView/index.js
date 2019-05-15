import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Dimmer, Loader } from 'semantic-ui-react';
import _ from 'lodash';

import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';
import * as Utils from '../../utils';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

class AlbumView extends React.Component {
  constructor(props) {
    super(props);
  }

  getArtistName (track, album) {
    if (!track.artists) {
      return album.artists[0].name;
    } else {
      let firstArtist = _.find(track.artists, artist => artist.join === '')
        .name;
      let artistName = firstArtist;
      _(track.artists)
        .filter(artist => artist.name !== firstArtist)
        .forEach(artist => {
          artistName += ' ' + artist.join + ' ' + artist.name;
        });

      return artistName;
    }
  }

  addAlbumToQueue (album) {
    album.tracklist.map(track => {
      this.props.addToQueue(this.props.musicSources, {
        artist: album.artists[0].name,
        name: track.title,
        thumbnail: album.images[0].uri
      });
    });
  }

  artistInfoSearch (artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  playAll (album) {
    this.props.clearQueue();
    this.addAlbumToQueue(album);
    this.props.selectSong(0);
    this.props.startPlayback();
  }

  renderInvalidData () {
    return (
      <div>
        <h3>Discogs returned invalid data.</h3>
        <h4>Try going back to search.</h4>
      </div>
    );
  }

  getAlbumImage (album) {
    let albumImage = _.find(album.images, { type: 'primary' });
    if (!albumImage) {
      albumImage = album.images ? album.images[0].uri : artPlaceholder;
    } else {
      albumImage = albumImage.uri;
    }
    return albumImage;
  }

  renderAlbumArtistName (album) {
    return (
      <div className={styles.album_artist}>
        by{' '}
        <a
          href='#'
          onClick={() => {
            this.artistInfoSearch.bind(this)(album.artists[0].id);
          }}
        >
          {album.artists[0].name}
        </a>
      </div>
    );
  }

  renderAlbumGenre (album) {
    return (
      <div className={styles.album_genre}>
        <label>Genre:</label>
        {album.genres[0]}
      </div>
    );
  }

  renderPlayAllButton (album) {
    return (
      <a
        onClick={() => this.playAll(album)}
        href='#'
        className={styles.play_button}
      >
        <FontAwesome name='play' /> Play
      </a>
    );
  }

  renderAlbumYear (album) {
    return (
      <div className={styles.album_year}>
        <label>Year:</label>
        {album.year}
      </div>
    );
  }

  renderAlbumTracksCount (album) {
    return (
      <div className={styles.album_tracks}>
        <label>Tracks:</label>
        {album.tracklist.length}
      </div>
    );
  }

  renderAlbumInfoBox (album, albumImage) {
    return (
      <div className={styles.album_info_box}>
        <img src={albumImage} />
        <div className={styles.album_details}>
          <div className={styles.album_title}>{album.title}</div>
          {this.renderAlbumArtistName(album)}
          {this.renderAlbumGenre(album)}
          {this.renderAlbumYear(album)}
          {this.renderAlbumTracksCount(album)}
          <div className={styles.album_buttons}>
            {this.renderPlayAllButton(album)}
            {this.renderOptionsButtons(album)}
          </div>
        </div>
      </div>
    );
  }

  renderAlbumLoading (album, albumImage) {
    return (
      <div className={styles.album_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={album.loading}>
            <Loader />
          </Dimmer>
          {
            album.loading !== true && (
              <div className={styles.album}>
                {this.renderAlbumInfoBox(album, albumImage)}
                {this.renderAlbumTracksList(album)}
              </div>
            )
          }
        </Dimmer.Dimmable>
      </div>
    );
  }

  renderTrack (track, album, index) {
    if (parseInt(track.duration) !== track.duration) {
      track.duration = Utils.stringDurationToSeconds(track.duration);
    }
    _.set(track, 'name', track.title);
    _.set(track, 'image[0][#text]', _.get(album, 'images[0].uri'));
    _.set(track, 'artist.name', this.getArtistName(track, album));
    return (<TrackRow
      key={'album-track-row-' + index}
      track={track}
      index={'album-track-' + index}
      displayTrackNumber
      displayDuration
    />);
  }

  renderTrackTableHeader () {
    return (<thead>
      <tr>
        <th className={styles.center}>
          <FontAwesome name='hashtag' />
        </th>
        <th className={styles.left}>Song</th>
        <th className={styles.center}>
          <FontAwesome name='clock-o' />
        </th>
      </tr>
    </thead>);
  }

  renderAlbumTracksList (album) {
    return (
      <table className={styles.album_tracklist}>
        {this.renderTrackTableHeader()}
        <tbody>
          {album.tracklist.map((track, index) => this.renderTrack(track, album, index)
          )}
        </tbody>
      </table>
    );
  }

  renderOptionsButtons (album) {
    return (
      <ContextPopup
        trigger={
          <a href='#' className={styles.more_button}>
            <FontAwesome name='ellipsis-h' />
          </a>
        }
        artist={album.artists[0].name}
        title={album.title}
        thumb={album.images ? album.images[0].uri : artPlaceholder}
      >
        <a
          href='#'
          onClick={() => this.addAlbumToQueue(album)}
          className={styles.add_button}
          aria-label='Add album to queue'
        >
          <FontAwesome name='plus' /> Add to queue
        </a>
      </ContextPopup>
    );
  }
  
  render () {
    let { album } = this.props;
    if (
      _.some(_.map([album.images, album.artists, album.genres], _.isEmpty)) &&
      album.loading !== true
    ) {
      return this.renderInvalidData();
    }

    let albumImage = this.getAlbumImage(album);
    return this.renderAlbumLoading(album, albumImage);
  }
}

export default AlbumView;

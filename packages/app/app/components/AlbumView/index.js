import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Icon, Loader } from 'semantic-ui-react';
import { ipcRenderer } from 'electron';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';
import * as Utils from '../../utils';
import {safeAddUuid} from '../../actions/helpers';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

@withTranslation('album')
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
    const albumThumbnail = this.getAlbumImage(album);
    album.tracklist.map(track => {
      this.props.addToQueue(this.props.musicSources, {
        artist: album.artists[0].name,
        name: track.title,
        thumbnail: albumThumbnail
      });
    });
  }

  addAlbumToDownloads(album) {
    const {
      addToDownloads,
      musicSources,
      info,
      settings,
      t
    } = this.props;
    _.forEach(album.tracklist, track => {
      const clonedTrack = safeAddUuid(track);
      ipcRenderer.send('start-download', clonedTrack);
      addToDownloads(musicSources, clonedTrack);
    });

    info(
      t('download-toast-title'),
      t('download-toast-content', {
        artist: _.head(album.artists).name,
        title: album.title
      }),
      <img src={this.getAlbumImage(album)}/>,
      settings
    );
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
        <Icon name='play' /> Play
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
        <a
          href='#'
          className={styles.album_favorites_button_wrap}
          onClick={
            this.props.isFavorite()
              ? () => this.props.removeFavoriteAlbum(album)
              : () => this.props.addFavoriteAlbum(album)
          }
        >
          <Icon
            name={this.props.isFavorite() ? 'star' : 'star outline'}
            size='big'
          />
        </a>
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
    _.set(track, 'thumbnail', this.getAlbumImage(album));
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
          <Icon name='hashtag' />
        </th>
        <th className={styles.left}>Song</th>
        <th className={styles.center}>
          <Icon name='clock outline' />
        </th>
      </tr>
    </thead>);
  }

  renderAlbumTracksList (album) {
    return (
      <table className={styles.album_tracklist}>
        {this.renderTrackTableHeader()}
        <tbody>
          {album.tracklist.map((track, index) => this.renderTrack(track, album, index))}
        </tbody>
      </table>
    );
  }

  renderOptionsButtons (album) {
    return (
      <ContextPopup
        trigger={
          <a href='#' className={styles.more_button}>
            <Icon name='ellipsis horizontal' />
          </a>
        }
        artist={album.artists[0].name}
        title={album.title}
        thumb={this.getAlbumImage(album)}
      >
        <a
          href='#'
          onClick={() => this.addAlbumToQueue(album)}
          aria-label={this.props.t('queue')}
        >
          <Icon name='plus' /> {this.props.t('queue')}
        </a>
        <a
          href="#"
          onClick={() => this.addAlbumToDownloads(album)}
        >
          <Icon name='download'/> {this.props.t('download')}
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

AlbumView.propTypes = {
  addFavoriteAlbum: PropTypes.func,
  isFavorite: PropTypes.func,
  addToDownloads: PropTypes.func,
  musicSources: PropTypes.array,
  settings: PropTypes.object
};

AlbumView.defaultProps = {
  addFavoriteAlbum: () => {},
  isFavorite: () => {},
  addToDownloads: () => {},
  musicSources: [],
  settings: {}
};

export default AlbumView;

import React from 'react';
import PropTypes from 'prop-types';
import Img from 'react-image';
import _ from 'lodash';
import { Dimmer, Icon, Loader } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { Loader as NuclearLoader, ContextPopup, PopupButton } from '@nuclear/ui';

import TrackRow from '../TrackRow';
import * as Utils from '../../utils';
import { safeAddUuid } from '../../actions/helpers';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

@withTranslation('album')
class AlbumView extends React.Component {
  constructor(props) {
    super(props);
  }

  addAlbumToQueue(album) {
    const albumThumbnail = this.getAlbumImage(album);
    album.tracklist.map(track => {
      this.props.addToQueue(this.props.streamProviders, {
        artist: album.artist,
        name: track.title,
        thumbnail: albumThumbnail
      });
    });
  }

  addAlbumToDownloads(album) {
    const {
      addToDownloads,
      streamProviders,
      info,
      settings,
      t
    } = this.props;
    _.forEach(album.tracklist, track => {
      const clonedTrack = safeAddUuid(track);
      addToDownloads(streamProviders, clonedTrack);
    });

    info(
      t('download-toast-title'),
      t('download-toast-content', {
        artist: album.artist,
        title: album.title
      }),
      <Img
        src={this.getAlbumImage(album)}
        loader={<NuclearLoader />}
        unloader={<img src={artPlaceholder} />}
      />,
      settings
    );
  }

  playAll(album) {
    this.props.clearQueue();
    this.addAlbumToQueue(album);
    this.props.selectSong(0);
    this.props.startPlayback();
  }

  renderInvalidData() {
    return (
      <div>
        <h3>Discogs returned invalid data.</h3>
        <h4>Try going back to search.</h4>
      </div>
    );
  }

  getAlbumImage(album) {
    return _.get(album, 'coverImage');
  }

  renderAlbumArtistName(album) {
    return (
      <div className={styles.album_artist}>
        by{' '}
        <a
          href='#'
          onClick={() => {
            this.props.artistInfoSearchByName(album.artist, this.props.history);
          }}
        >
          {album.artist}
        </a>
      </div>
    );
  }

  renderAlbumGenre(album) {
    return (
      !_.isEmpty(album.genres) &&
      <div className={styles.album_genre}>
        <label>Genre:</label>
        {album.genres.join(', ')}
      </div>
    );
  }

  renderPlayAllButton(album) {
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

  renderAlbumYear(album) {
    return (
      <div className={styles.album_year}>
        <label>Year:</label>
        {album.year}
      </div>
    );
  }

  renderAlbumTracksCount(album) {
    return (
      <div className={styles.album_tracks}>
        <label>Tracks:</label>
        {album.tracklist.length}
      </div>
    );
  }

  renderAlbumInfoBox(album, albumImage) {
    return (
      <div className={styles.album_info_box}>
        <Img
          src={albumImage}
          loader={<NuclearLoader type='small' />}
          unloader={<img src={artPlaceholder} />}
        />
        <div className={styles.album_details}>
          <div className={styles.album_title}>{album.title}</div>
          {this.renderAlbumArtistName(album)}
          {this.renderAlbumGenre(album)}
          {
            album.year &&
            this.renderAlbumYear(album)
          }
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

  renderAlbumLoading(album, albumImage) {
    return (
      <div className={styles.album_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={album?.loading}>
            <Loader />
          </Dimmer>
          {
            album?.loading !== true && (
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

  renderTrack(track, album, index) {
    if (parseInt(track.duration) !== track.duration) {
      track.duration = Utils.stringDurationToSeconds(track.duration);
    }
    _.set(track, 'name', track.title);
    _.set(track, 'thumbnail', this.getAlbumImage(album));
    _.set(track, 'artist.name', album.artist);
    return (<TrackRow
      key={'album-track-row-' + index}
      track={track}
      index={'album-track-' + index}
      displayTrackNumber
      displayDuration
    />);
  }

  renderTrackTableHeader() {
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

  renderAlbumTracksList(album) {
    return (
      <table className={styles.album_tracklist}>
        {this.renderTrackTableHeader()}
        <tbody>
          {album.tracklist.map((track, index) => this.renderTrack(track, album, index))}
        </tbody>
      </table>
    );
  }

  renderOptionsButtons(album) {
    return (
      <ContextPopup
        trigger={
          <a href='#' className={styles.more_button}>
            <Icon name='ellipsis horizontal' />
          </a>
        }
        artist={album.artist}
        title={album.title}
        thumb={this.getAlbumImage(album)}
      >
        <PopupButton
          onClick={() =>
            this.addAlbumToQueue(album)
          }
          ariaLabel={this.props.t('queue')}
          icon='plus'
          label={this.props.t('queue')}
        />
        <PopupButton
          onClick={() =>
            this.addAlbumToDownloads(album)}
          ariaLabel={this.props.t('download')}
          icon='download'
          label={this.props.t('download')}
        />
      </ContextPopup>
    );
  }

  render() {
    const { album } = this.props;

    const albumImage = this.getAlbumImage(album);
    return this.renderAlbumLoading(album, albumImage);
  }
}

AlbumView.propTypes = {
  addFavoriteAlbum: PropTypes.func,
  isFavorite: PropTypes.func,
  addToDownloads: PropTypes.func,
  streamProviders: PropTypes.array,
  settings: PropTypes.object
};

AlbumView.defaultProps = {
  addFavoriteAlbum: () => { },
  isFavorite: () => { },
  addToDownloads: () => { },
  streamProviders: [],
  settings: {}
};

export default AlbumView;

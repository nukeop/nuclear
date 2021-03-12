import React from 'react';
import Img from 'react-image';
import _ from 'lodash';
import { Dimmer, Icon, Loader } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Loader as NuclearLoader, ContextPopup, PopupButton, TrackRow } from '@nuclear/ui';
import { AlbumDetails } from '@nuclear/core/src/plugins/plugins.types';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

type AlbumViewProps = {
  album?: AlbumDetails & {
    loading?: boolean;
  };
  isFavorite: boolean;
  searchAlbumArtist: React.MouseEventHandler;
  addAlbumToDownloads: React.MouseEventHandler;
  addAlbumToQueue: React.MouseEventHandler;
  playAll: React.MouseEventHandler;
  removeFavoriteAlbum: React.MouseEventHandler;
  addFavoriteAlbum: React.MouseEventHandler;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  album,
  isFavorite,
  searchAlbumArtist,
  addAlbumToDownloads,
  addAlbumToQueue,
  playAll,
  removeFavoriteAlbum,
  addFavoriteAlbum
}) => {
  const { t } = useTranslation('album');

  return <div className={styles.album_view_container}>
    <Dimmer.Dimmable>
      <Dimmer active={album?.loading}>
        <Loader />
      </Dimmer>
      {
        Boolean(album) && !album.loading && (
          <div className={styles.album}>
            <div className={styles.album_info_box}>
              <Img
                src={album.coverImage}
                loader={<NuclearLoader type='small' />}
                unloader={<img src={String(artPlaceholder)} />}
              />
              <div className={styles.album_details}>
                <div className={styles.album_title}>{album.title}</div>
                <div className={styles.album_artist}>
                  by{' '}
                  <a
                    href='#'
                    onClick={searchAlbumArtist}
                  >
                    {album?.artist}
                  </a>
                </div>
                {
                  !_.isEmpty(album.genres) &&
                  <div className={styles.album_genre}>
                    <label>Genre:</label>
                    {album.genres.join(', ')}
                  </div>
                }
                {
                  album.year &&
                  <div className={styles.album_year}>
                    <label>Year:</label>
                    {album.year}
                  </div>
                }
                <div className={styles.album_tracks}>
                  <label>Tracks:</label>
                  {album.tracklist.length}
                </div>
                <div className={styles.album_buttons}>
                  <a
                    onClick={playAll}
                    href='#'
                    className={styles.play_button}
                  >
                    <Icon name='play' /> Play
                  </a>
                  <ContextPopup
                    trigger={
                      <a href='#' className={styles.more_button}>
                        <Icon name='ellipsis horizontal' />
                      </a>
                    }
                    artist={album.artist}
                    title={album.title}
                    thumb={album.coverImage}
                  >
                    <PopupButton
                      onClick={addAlbumToQueue}
                      ariaLabel={t('queue')}
                      icon='plus'
                      label={t('queue')}
                    />
                    <PopupButton
                      onClick={addAlbumToDownloads}
                      ariaLabel={t('download')}
                      icon='download'
                      label={t('download')}
                    />
                  </ContextPopup>
                </div>
              </div>
              <a
                href='#'
                className={styles.album_favorites_button_wrap}
                onClick={
                  isFavorite
                    ? removeFavoriteAlbum
                    : addFavoriteAlbum
                }
              >
                <Icon
                  name={isFavorite ? 'star' : 'star outline'}
                  size='big'
                />
              </a>
            </div>
            <table className={styles.album_tracklist}>
              <thead>
                <tr>
                  <th className={styles.center}>
                    <Icon name='hashtag' />
                  </th>
                  <th className={styles.left}>Song</th>
                  <th className={styles.center}>
                    <Icon name='clock outline' />
                  </th>
                </tr>
              </thead>
              <tbody>
                {album.tracklist.map((track, index) => <TrackRow
                  key={'album-track-row-' + index}
                  track={track}
                  index={'album-track-' + index}
                  displayTrackNumber
                  displayDuration
                />)}
              </tbody>
            </table>
          </div>
        )
      }
    </Dimmer.Dimmable>
  </div>;
};

// @withTranslation('album')
// class AlbumView extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   addAlbumToQueue(album) {
//     const albumThumbnail = this.getAlbumImage(album);
//     album.tracklist.map(track => {
//       this.props.addToQueue({
//         artist: album.artist,
//         name: track.title,
//         thumbnail: albumThumbnail
//       });
//     });
//   }

//   addAlbumToDownloads(album) {
//     const {
//       addToDownloads,
//       streamProviders,
//       info,
//       settings,
//       t
//     } = this.props;
//     _.forEach(album.tracklist, track => {
//       const clonedTrack = safeAddUuid(track);
//       addToDownloads(streamProviders, clonedTrack);
//     });

//     info(
//       t('download-toast-title'),
//       t('download-toast-content', {
//         artist: album.artist,
//         title: album.title
//       }),
//       <Img
//         src={this.getAlbumImage(album)}
//         loader={<NuclearLoader />}
//         unloader={<img src={artPlaceholder} />}
//       />,
//       settings
//     );
//   }

//   playAll(album) {
//     this.props.clearQueue();
//     this.addAlbumToQueue(album);
//     this.props.selectSong(0);
//     this.props.startPlayback();
//   }

//   renderInvalidData() {
//     return (
//       <div>
//         <h3>Discogs returned invalid data.</h3>
//         <h4>Try going back to search.</h4>
//       </div>
//     );
//   }

//   getAlbumImage(album) {
//     return _.get(album, 'coverImage');
//   }

//   renderAlbumArtistName(album) {
//     return (
//       <div className={styles.album_artist}>
//         by{' '}
//         <a
//           href='#'
//           onClick={() => {
//             this.props.artistInfoSearchByName(album.artist, this.props.history);
//           }}
//         >
//           {album.artist}
//         </a>
//       </div>
//     );
//   }

//   renderPlayAllButton(album) {
//     return (

//     );
//   }

//   renderAlbumYear(album) {
//     return (

//     );
//   }

//   renderAlbumTracksCount(album) {
//     return (

//     );
//   }

//   renderAlbumInfoBox(album, albumImage) {
//     return (
//       <div className={styles.album_info_box}>
//         <Img
//           src={albumImage}
//           loader={<NuclearLoader type='small' />}
//           unloader={<img src={artPlaceholder} />}
//         />
//         <div className={styles.album_details}>
//           <div className={styles.album_title}>{album.title}</div>
//           {this.renderAlbumArtistName(album)}
//           {this.renderAlbumGenre(album)}
//           {
//             album.year &&
//             this.renderAlbumYear(album)
//           }
//           {this.renderAlbumTracksCount(album)}
//           <div className={styles.album_buttons}>
//             {this.renderPlayAllButton(album)}
//             {this.renderOptionsButtons(album)}
//           </div>
//         </div>
//         <a
//           href='#'
//           className={styles.album_favorites_button_wrap}
//           onClick={
//             this.props.isFavorite()
//               ? () => this.props.removeFavoriteAlbum(album)
//               : () => this.props.addFavoriteAlbum(album)
//           }
//         >
//           <Icon
//             name={this.props.isFavorite() ? 'star' : 'star outline'}
//             size='big'
//           />
//         </a>
//       </div>
//     );
//   }

//   renderAlbumLoading(album, albumImage) {
//     return (
//       <div className={styles.album_view_container}>
//         <Dimmer.Dimmable>
//           <Dimmer active={album?.loading}>
//             <Loader />
//           </Dimmer>
//           {
//             album?.loading !== true && (
//               <div className={styles.album}>
//                 {this.renderAlbumInfoBox(album, albumImage)}
//                 {this.renderAlbumTracksList(album)}
//               </div>
//             )
//           }
//         </Dimmer.Dimmable>
//       </div>
//     );
//   }

//   renderTrack(track, album, index) {
//     if (parseInt(track.duration) !== track.duration) {
//       track.duration = Utils.stringDurationToSeconds(track.duration);
//     }
//     _.set(track, 'name', track.title);
//     _.set(track, 'thumbnail', this.getAlbumImage(album));
//     _.set(track, 'artist.name', album.artist);
//     return (<TrackRow
//       key={'album-track-row-' + index}
//       track={track}
//       index={'album-track-' + index}
//       displayTrackNumber
//       displayDuration
//     />);
//   }

//   renderTrackTableHeader() {
//     return ();
//   }

//   renderAlbumTracksList(album) {
//     return (
//       <table className={styles.album_tracklist}>
//         {this.renderTrackTableHeader()}
//         <tbody>
//           {album.tracklist.map((track, index) => this.renderTrack(track, album, index))}
//         </tbody>
//       </table>
//     );
//   }

//   renderOptionsButtons(album) {
//     return (

//     );
//   }

//   render() {
//     const { album } = this.props;

//     const albumImage = this.getAlbumImage(album);
//     return this.renderAlbumLoading(album, albumImage);
//   }
// }

export default AlbumView;

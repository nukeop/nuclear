import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Dimmer, Loader, Image, Segment} from 'semantic-ui-react';

import ContextPopup from '../ContextPopup';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

class AlbumView extends React.Component {
  constructor(props) {
    super(props);
  }

  getArtistName(track, album) {
    if (!track.artists) {
      return album.artists[0].name;
    } else {
      let firstArtist = _.find(track.artists, artist => artist.join === '').name;
      let artistName = firstArtist;
      _(track.artists).filter(artist => artist.name != firstArtist).forEach(
        artist => {
          artistName += ' ' + artist.join + ' ' + artist.name;
        });

      return artistName;
    }
  }

  addToQueue(album, track) {
    this.props.addToQueue(
      this.props.musicSources,
      {
        artist: this.getArtistName(track, album),
        name: track.title,
        thumbnail: album.images[0].uri
      }
    );
  }

  addAlbumToQueue(album) {
    album.tracklist.map((track, i) => {
      this.props.addToQueue(this.props.musicSources, {
        artist: album.artists[0].name,
        name: track.title,
        thumbnail: album.images[0].uri
      });
    });
  }

  artistInfoSearch(artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  playAll(album) {
    this.props.clearQueue();
    this.addAlbumToQueue(album);
    this.props.selectSong(0);
    this.props.startPlayback();
  }

  renderOptions(album) {
    return(
      <ContextPopup
        trigger={<a href="#" className={styles.more_button}><FontAwesome name="ellipsis-h" /></a>}
        artist={album.artists[0].name}
        title={album.title}
        thumb={album.images ? album.images[0].uri : artPlaceholder}
      >
        <a
          href='#'
          onClick={
            () => this.addAlbumToQueue(album)
          }
          className={styles.add_button}
        >
          <FontAwesome name="plus" /> Add to queue
        </a>
      </ContextPopup>
    );
  }

  render() {
    let {
      album
    } = this.props;
    return (
      <div className={styles.album_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={album.loading}>
            <Loader/>
          </Dimmer>

          {
            !album.loading &&
            <div className={styles.album}>
              <div className={styles.album_info_box}>
                <img src={album.images ? album.images[0].uri : artPlaceholder}/>
                <div className={styles.album_details}>
                  <div className={styles.album_title}>{album.title}</div>
                  <div className={styles.album_artist}>by <a href='#' onClick={() => {this.artistInfoSearch.bind(this)(album.artists[0].id);}}>{album.artists[0].name}</a></div>
                  <div className={styles.album_genre}>
                    <label>Genre:</label>
                    { album.styles && Object.keys(album.styles) > 0 && album.styles[0] }
                  </div>

                  <div className={styles.album_year}>
                    <label>Year:</label>
                    {album.year}
                  </div>
                  <div className={styles.album_tracks}>
                    <label>Tracks:</label>
                    {album.tracklist.length}
                  </div>
                  <div className={styles.album_buttons}>
                    <a
                      onClick={() => this.playAll(album)}
                      href="#"
                      className={styles.play_button}
                    ><FontAwesome name="play" /> Play</a>
                    {this.renderOptions(album)}
                  </div>
                </div>

              </div>

              <table className={styles.album_tracklist}>
                <thead>
                  <tr>
                    <th className={styles.center}><FontAwesome name="hashtag" /></th>
                    <th className={styles.left}>Song</th>
                    <th className={styles.center}><FontAwesome name="clock-o" /></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    album.tracklist.map((el, i) => {
                      return (
                        <ContextPopup
                          key={i}
                          trigger={
                            <tr>
                              <td className={styles.center}>{i + 1}</td>
                              <td className={styles.left}>{el.title}</td>
                              <td className={styles.center}>{el.duration}</td>
                            </tr>
                          }
                          artist={album.artists[0].name}
                          title={el.title}
                          thumb={album.images[0].uri}
                        >
                          <a
                            href='#'
                            onClick={
                              () => this.addToQueue(album, el)
                            }
                            className={styles.add_button}
                          >
                            <FontAwesome name="plus" /> Add to queue
                          </a>
                          <a
                            href='#'
                            onClick={
                              () => {
                                this.props.clearQueue();
                                this.addToQueue(album, el);
                                this.props.selectSong(0);
                                this.props.startPlayback();
                              }
                            }
                            className={styles.add_button}
                          ><FontAwesome name="play" /> Play now
                          </a>
                        </ContextPopup>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          }

        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default AlbumView;

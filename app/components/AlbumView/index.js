import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Dimmer, Loader, Image, Segment} from 'semantic-ui-react';

import ContextPopup from '../ContextPopup';

import styles from './styles.scss';

class AlbumView extends React.Component {
  constructor(props) {
    super(props);
  }

  artistInfoSearch(artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  render() {
    return (
      <div className={styles.album_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={this.props.album.loading}>
            <Loader/>
          </Dimmer>

          {
            this.props.album.loading
              ? null
              : <div className={styles.album}>
                  <div className={styles.album_info_box}>
                    <img src={this.props.album.images[0].uri}/>
                    <div className={styles.album_details}>
                      <div className={styles.album_title}>{this.props.album.title}</div>
                      <div className={styles.album_artist}>by <a href='#' onClick={() => {this.artistInfoSearch.bind(this)(this.props.album.artists[0].id)}}>{this.props.album.artists[0].name}</a></div>
                      <div className={styles.album_genre}>
                        <label>Genre:</label>
                        {this.props.album.styles[0]}</div>

                      <div className={styles.album_year}>
                        <label>Year:</label>
                        {this.props.album.year}</div>
                      <div className={styles.album_tracks}>
                        <label>Tracks:</label>
                        {this.props.album.tracklist.length}</div>
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
                      this.props.album.tracklist.map((el, i) => {
                        return (
                          <ContextPopup
                            trigger={
                              <tr>
                                <td className={styles.center}>{i + 1}</td>
                                <td className={styles.left}>{el.title}</td>
                                <td className={styles.center}>{el.duration}</td>
                              </tr>
                            }
                            artist={this.props.album.artists[0].name}
                            title={el.title}
                            thumb={this.props.album.images[0].uri}
                          >
                            <a href='#'
                              onClick={() => this.props.addToQueue(this.props.musicSources, {
                                artist: this.props.album.artists[0].name,
                                name: el.title,
                                thumbnail: this.props.album.images[0].uri
                              })}
                              className={styles.add_button}
                              >
                                <FontAwesome name="plus" /> Add to queue
                            </a>
                            <a href='#' className={styles.add_button}><FontAwesome name="play" /> Play now</a>
                          </ContextPopup>
                        )
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

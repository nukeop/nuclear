import React, { Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import styles from './AlbumView.css';

const SortableItem = SortableElement(({value, playTrack}) =>
  <tr>
    <td width='40px'>
      <div className={styles.album_view_track_play_btn_container}>
        <a href='#' onClick={playTrack.bind(null, value)}><i className="fa fa-play" /></a>
      </div>
      <span className={styles.album_view_track_number}>{value.position}</span>
      </td>
    <td>{value.recording.title}</td>
    <td>{Math.floor((value.length/1000)/60) + ':' + Math.floor((value.length/1000) - Math.floor((value.length/1000)/60)*60)}</td>
  </tr>);

const SortableList = SortableContainer(({items, playTrack}) => {
	return (
		<tbody>
			{items.map((value, index) =>
                <SortableItem
                  disabled
                  key={`item-${index}`}
                  index={index}
                  value={value}
                  playTrack={playTrack}
                />
            )}
		</tbody>
	);
});

export default class AlbumView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var th = this;
    return (
      <div className={styles.album_view_container}>

        <table>
          <tr>
            <td>
              <div className={styles.album_view_cover_art_container}>
                <img className={styles.album_view_cover_art} src={this.props.album.image[2]['#text']} />
              </div>
            </td>
            <td>
              <div className={styles.album_view_info_container}>
                <div className={styles.album_view_album_title}>{this.props.album.name}</div>
                <div className={styles.album_view_album_artist}>by {this.props.album.artist}</div>

                <div className={styles.album_view_misc_info_container}>
                  <div className={styles.album_view_misc_info_line}>
                    <div className={styles.album_view_misc_info}>Release date:</div>
                    <div className={styles.album_view_misc_info_value}>{this.props.release.date!==null?this.props.release.date:'Unknown'}</div>
                  </div>

                  <div className={styles.album_view_misc_info_line}>
                    <div className={styles.album_view_misc_info}>Tracks:</div>
                    <div className={styles.album_view_misc_info_value}>{this.props.release.mediums[0].tracks.length}</div>
                  </div>

                  <div className={styles.album_view_misc_info_line}>
                    <div className={styles.album_view_misc_info}>Length:</div>
                    <div className={styles.album_view_misc_info_value}>{this.props.release.minutes}:{this.props.release.seconds}</div>
                  </div>
                </div>

              </div>
            </td>
          </tr>
        </table>

        <table className={styles.album_view_track_list}>
          <thead>
            <tr>
              <th>#</th>
              <th>Song</th>
              <th><i className="fa fa-clock-o" /></th>
            </tr>
          </thead>

            <SortableList
              items={this.props.release.mediums[0].tracks}
              playTrack={this.props.playTrack}
            />

        </table>

      </div>
    );
  }
}

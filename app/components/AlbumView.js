import React, { Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import styles from './AlbumView.css';

const SortableItem = SortableElement(({value}) => <div style={{display: 'inline-block'}}>{value}</div>);

const SortableList = SortableContainer(({items}) => {
	return (
		<div>
			{items.map((value, index) =>
                <SortableItem disabled key={`item-${index}`} index={index} value={value} />
            )}
		</div>
	);
});

export default class AlbumView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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

                <div className={styles.album_view_misc_info}>Release date:</div>
                <div className={styles.album_view_misc_info_value}>{this.props.release.date}</div><br />

                <div className={styles.album_view_misc_info}>Tracks:</div>
                <div className={styles.album_view_misc_info_value}>{this.props.release.mediums[0].tracks.length}</div><br />

                <div className={styles.album_view_misc_info}>Length:</div>
                <div className={styles.album_view_misc_info_value}>{this.props.release.minutes}:{this.props.release.seconds}</div><br />

              </div>
            </td>
          </tr>
        </table>



      </div>
    );
  }
}

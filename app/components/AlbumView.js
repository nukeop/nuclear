import React, { Component } from 'react';
import Popover from 'react-popover';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import ContentPopover from './ContentPopover';

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

    this.state={
      popoverOpen: false
    };
  }

  openPopover() {
    this.setState({popoverOpen: true});
  }

  closePopover() {
    this.setState({popoverOpen: false});
  }

  buttons() {
    return [
      {
        text: (<span><i className="fa fa-plus" /> Add to queue</span>),
        fun: this.props.addAlbumToQueue.bind(null, this.props.album, false)
      },
      {
        text: (<span><i className="fa fa-plus-square" /> Play next</span>),
        fun: null
      },
      {
        text: (<span><i className="fa fa-download" /> Download</span>),
        fun: null
      }
    ];
  }

  renderPopover() {
    return (
      <Popover
        body={
          <ContentPopover
            graphic={this.props.album.image[1]['#text']}
            artist={this.props.album.artist}
            title={this.props.album.name}
            buttons={this.buttons()}
          />
        }
        preferPlace='below'
        isOpen={this.state.popoverOpen}
        onOuterAction={this.closePopover.bind(this)}
        >
          <a className={styles.album_view_show_more_btn} href='#' onClick={this.openPopover.bind(this)}><i className="fa fa-ellipsis-h" /></a>
      </Popover>
    );
  }

  render() {
    return (
      <div className={styles.album_view_container}>

        <table>
          <tr>
            <td>
              <div className={styles.album_view_cover_art_container}>
                <img className={styles.album_view_cover_art} src={this.props.album.image[3]['#text']} />
              </div>
            </td>
            <td style={{display: 'block'}}>
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

                <a className={styles.album_view_play_all_btn} href='#' onClick={this.props.addAlbumToQueue.bind(null, this.props.album, true)}><i className="fa fa-play" /> PLAY</a>
                {this.renderPopover()}

              </div>
            </td>
          </tr>
        </table>

        {this.props.release.mediums.map((el, i) => {

          var tableStyle = this.props.release.mediums.length>1 ? {} : {marginTop: '36px'};
          var cdStyle = i===0 ? {marginTop: '36px'} : {};

          return (

            <div>
              {
                this.props.release.mediums.length>1
                ? <div style={cdStyle} className={styles.album_view_cd}><i className="fa fa-circle" /> CD {i+1}</div>
                : null
              }

              <table style={tableStyle} className={styles.album_view_track_list}>

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Song</th>
                    <th><i className="fa fa-clock-o" /></th>
                  </tr>
                </thead>

                <SortableList
                  items={el.tracks}
                  playTrack={this.props.playTrack}
                />

              </table>
            </div>
          );
        })

      }



      </div>
    );
  }
}

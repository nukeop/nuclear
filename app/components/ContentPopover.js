import React, { Component } from 'react';

import styles from './ContentPopover.css';

export default class ContentPopover extends Component {
  constructor(props) {
    super(props);

    // // Props:
    // graphic
    // artist
    // title
    // buttons (list)
  }

  render() {
    return (
      <div className={styles.popover}>
        <table className={styles.popover_table}>
          <tr>
            <td>
              <img className={styles.popover_cover_art} src={this.props.graphic} />
            </td>
            <td className={styles.popover_album_info}>
              <div className={styles.popover_album_title}>
                {this.props.title}
              </div>
              {
                (this.props.artist===undefined || this.props.artist===null)
                ? null
                : (
                  <div className={styles.popover_artist}>
                    by {this.props.artist}
                  </div>
                )
              }
            </td>
          </tr>
          <tr>
            <td colSpan='2'><hr className={styles.popover_separator} /></td>
          </tr>

          {
            (this.props.buttons===undefined || this.props.buttons===null)
            ? null
            : this.props.buttons.map((el, i) => {

              return (

                <tr className={styles.popover_button_row}>
                  <td colSpan='2'>
                    <a className={styles.popover_button} href='#' onClick={el.fun}>{el.text}</a>
                  </td>
                </tr>

              );

            })
          }
        </table>

      </div>
    );
  }
}

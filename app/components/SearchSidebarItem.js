import React, { Component } from 'react';

import styles from './SearchSidebarItem.css';

export default class SearchSidebarItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.thumbnail);
    return (
      <div className={styles.sidebar_item_container}>
        <img
          className={styles.sidebar_item_thumbnail}
          src={
            this.props.thumbnail !== ''
            ? this.props.thumbnail
            : '../media/img/default-search-item.png'
          }
        />
        <div className={styles.sidebar_item_info} >

          <div className={styles.sidebar_item_name}>
            <a href='#'>{this.props.name}</a>
          </div>
          {
            this.props.artist != undefined
            ? <div className={styles.sidebar_item_artist}>
              by <a href='#'>{this.props.artist}</a>
            </div>
            : <span />
          }

        </div>
      </div>
    );
  }
}

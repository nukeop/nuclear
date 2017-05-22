import React, { Component } from 'react';

import styles from './SearchSidebarItem.css';

export default class SearchSidebarItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.sidebar_item_container}>
        <img src={this.props.thumbnail} />
        <div className={styles.sidebar_item_info} >

          <div className={styles.sidebar_item_name}>
            <a href='#'>{this.props.name}</a>
          </div>
          {
            this.props.artist !== undefined
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

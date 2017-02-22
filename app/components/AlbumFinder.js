import React, { Component } from 'react';
import DebounceInput from 'react-debounce-input';

import styles from './AlbumFinder.css';

export default class AlbumFinder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var lineEndSymbol = '';
    if (this.props.searchTerms!=='' && !this.props.resultsLoading) {
      lineEndSymbol = (<a href='#' className={`${styles.clear_button} btn btn-default`}><i className="fa fa-times" /></a>);
    } else if (this.props.resultsLoading) {
      lineEndSymbol = (<a href='#' className={`${styles.clear_button} btn btn-default`}><i className="fa fa-spinner fa-pulse fa-fw" /></a>);
    }

    return (
      <div style={{width: '100%', height: '100%'}}>
        <form style={{display: 'flex'}} className="form-inline" onSubmit={(event) => {event.preventDefault(); return false;}}>
          <div style={{width: '90%', marginRight:'auto'}} className="input-group">
            <div className="input-group-addon searchicon"><i className="fa fa-search"/></div>
            <DebounceInput
              className="form-control searchfield"
              placeholder="Search..."
              minLength={2}
              debounceTimeout={500}
              onChange={this.props.handleAlbumSearch}
            />
          </div>
          <div className={styles.line_end_symbol}>
            { lineEndSymbol }
          </div>
        </form>

          <table className={styles.albumfinder_table}>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Album</th>
                <th>Cover</th>
              </tr>
            </thead>

            <tbody>

              {this.props.albums.map((el, i) => {
                return (
                  <tr>
                    <td>{el.artist}</td>
                    <td>{el.name}</td>
                    <td><img src={el.image[2]['#text']} /></td>
                  </tr>
                );
              })}

            </tbody>
          </table>
      </div>
    );
  }
}

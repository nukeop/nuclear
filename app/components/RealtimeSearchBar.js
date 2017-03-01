import React, { Component } from 'react';
import DebounceInput from 'react-debounce-input';

import styles from './RealtimeSearchBar.css';

export default class RealtimeSearchBar extends Component {
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
      <form
        style={{display: 'flex', marginTop: '4px'}}
        className="form-inline"
        onSubmit={(event) => {event.preventDefault(); return false;}}
      >
        <div style={{width: '90%', marginRight:'auto'}} className="input-group">
          <div className="input-group-addon searchicon"><i className="fa fa-search"/></div>
          <DebounceInput
            className="form-control searchfield"
            placeholder="Search..."
            minLength={2}
            debounceTimeout={500}
            onChange={this.props.handleSearch}
            ref={(input) => { this.debounceInput = input; }}
            autoFocus
          />
        </div>
        <div className={styles.line_end_symbol}>
          { lineEndSymbol }
        </div>
      </form>
    );
  };
}

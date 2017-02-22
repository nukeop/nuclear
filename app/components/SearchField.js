import React, { Component } from 'react';

import Multiselect from 'react-bootstrap-multiselect';
import styles from './SearchField.css';

export default class SearchField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowableSources: [
        { value: 'youtube' },
        { value: 'youtube playlists' },
        { value: 'bandcamp' },
        { value: 'soundcloud' },
        { value: 'mp3monkey' },
      ],
      selectedSources: []
    };
  }

  handleChange(event, value) {
    if (value) {
      this.state.selectedSources.push(event[0].value);
    } else {
      this.state.selectedSources.splice(this.state.selectedSources.indexOf(event[0].value), 1);
    }
  }


handleSearch(event, value){
  return this.props.handleSearch(event, value, this.state.selectedSources);
}


  render() {
    const searchFieldStyle = {width: "75%", 'paddingTop': '1px'};
    const sourceButtonStyle = {width: "25%"};
    return (
      <form className="form-inline" onSubmit={(event) => {event.preventDefault(); return false;}}>
        <div className="form-group searchfield-group">
          <div style={searchFieldStyle} className="input-group">
            <div className="input-group-addon searchicon"><i className="fa fa-search"/></div>
            <input type="text" id="searchField" className="form-control searchfield" placeholder="Search..." onKeyPress={this.handleSearch.bind(this)} />
          </div>

          <div style={sourceButtonStyle} className="input-group">
            <Multiselect
              id="sourceMultiselect"
              ref="sourceMultiselect_ref"
              onChange={this.handleChange.bind(this)}
              buttonClass="btn btn-default multiselect-search-source"
              data={this.state.allowableSources}
              multiple
            />
          </div>
        </div>
      </form>
    );
  }
}

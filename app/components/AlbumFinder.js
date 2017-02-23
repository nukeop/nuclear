import React, { Component } from 'react';
import DebounceInput from 'react-debounce-input';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import AlbumCover from './AlbumCover';

import styles from './AlbumFinder.css';

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

    var albumElements = this.props.albums.map((el, i) => {
        return (<AlbumCover
          album={el}
        />);
    });



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

        <SortableList axis='xy' items={albumElements} />

      </div>
    );
  }
}

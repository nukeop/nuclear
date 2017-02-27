import React, { Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import styles from './AlbumGrid.css';

import AlbumCover from './AlbumCover';

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

export default class AlbumGrid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var albumElements = this.props.albums.filter((value) => {
      return value.mbid !== "";
    }).map((el, i) => {
        return (<AlbumCover
          album={el}
          goToAlbum={this.props.goToAlbum.bind(null, el)}
          addAlbumToQueue={this.props.addAlbumToQueue.bind(null, el, true)}
        />);
    });

    return (
      <div>
        {
          this.props.albums.length > 0
          ? <div className={styles.album_finder_search_header}>
                Search results for '{this.props.searchTerms}'
            </div>
          : null
        }

        <SortableList axis='xy' items={albumElements} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import ArtistCover from './ArtistCover';

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

export default class ArtistGrid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var artistElements = this.props.artists.filter((value) => {
      return value.mbid !== "";
    }).map((el, i) => {
      return (
        <ArtistCover
          artist={el}
          goToArtist={this.props.goToArtist.bind(null, el)}
        />
      );
    });

    return (
      <div>
        <SortableList axis='xy' items={artistElements} />
      </div>
    );
  }
}

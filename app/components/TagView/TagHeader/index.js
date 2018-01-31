import React from 'react';
import _ from 'lodash';

import styles from './styles.scss';

class TagHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      tag,
      tagInfo,
      topArtists
    } = this.props;
    return (
      <div className={styles.tag_header_container}>
        <div
	   style={{backgroundImage: `url(${_.last(topArtists[0].image)['#text']})`}}
	   className={styles.tag_header_background}
	   />
        <div className={styles.tag_header_name}>
	  #{tag}
	</div>
      </div>
    );
  }
}

export default TagHeader;

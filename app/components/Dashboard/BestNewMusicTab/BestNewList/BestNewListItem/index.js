import React from 'react';

import styles from './styles.scss';

class BestNewListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      item,
      onMouseEnter
    } = this.props;
    return(
      <div onMouseEnter={onMouseEnter} className={styles.best_new_list_item}>
	<div
	   className={styles.item_thumbnail}
	   style={{
	       backgroundImage: `url(${item.thumbnail})`
	     }}/>
	
      </div>
    );
  }
}

export default BestNewListItem;

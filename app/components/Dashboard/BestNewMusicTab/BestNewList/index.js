import React from 'react';

import styles from './styles.scss';

class BestNewList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      data
    } = this.props;

    return (
      <div className={styles.best_new_list_container}>

	{
	  data.map((el, i) => {
	    return (
	      <div className={styles.list_item}>
		<img src={el.thumbnail} />
	      </div>
	    );
	  })
	}
	
      </div>
    );
  }
}

export default BestNewList;

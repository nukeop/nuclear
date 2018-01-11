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
		<div className={styles.list_item_container}>

                  <div className={styles.left_pane}>
		    <div className={styles.thumbnail}>
		      <img src={el.thumbnail} />
		    </div>

		    <div className={styles.misc_info}>
                      <div>
			{el.artist} - {unescape(el.title)}
		      </div>
                      <div>
			{el.abstract}
		      </div>
                      <div>
			{el.genres}
		      </div>
		    </div>

		    <div className={styles.score_container}>
		      <div className={styles.score}>
			{el.score}
			</div>
		      </div>
		  </div>
		  
		  <div className={styles.right_pane}>
		    <div className={styles.abstract}>
		      {el.review.substring(0, 375) + '...'}
		    </div>
		  </div>
		  
		</div>
		
	      </div>
	    );
	  })
      }
      
      </div>
    );
  }
}

export default BestNewList;

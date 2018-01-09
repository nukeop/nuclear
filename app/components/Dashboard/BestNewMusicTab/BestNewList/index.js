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
	    console.log(el);
	    return (
	      <div className={styles.list_item}>
                <div className={styles.thumbnail}>
		  <img src={el.thumbnail} />
		</div>
		<div classname={styles.review_box}>
                  <div>
		    {el.artist} - {el.title}
		  </div>
                  <div>
		    {el.abstract}
		  </div>
                  <div>
		    {el.score}
		  </div>
                  <div>
		    {el.genres}
		  </div>
                  <div>
		    <a href={el.reviewUrl}>Full review</a>
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

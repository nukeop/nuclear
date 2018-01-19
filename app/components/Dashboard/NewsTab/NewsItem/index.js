import React from 'react';
import moment from 'moment';

import styles from './styles.scss';

class NewsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      item
    } = this.props;
    return (
      <div className={styles.news_item}>
	<h1>
	  {item.title}
	</h1>
        <h4>
	  {moment.unix(item.timestamp).format('dddd, MMMM, Do YYYY, h:mm:ss A')}
	</h4>

        <p>
	  {item.body}
	</p>

	{
	  item.tags.map((tag, i) => {
	    return <span>{tag}</span>;
	  })
	}
      </div>
    );
  }
}

export default NewsItem;

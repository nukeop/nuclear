import React from 'react';
import {Dimmer, Loader, Tab} from 'semantic-ui-react';
import moment from 'moment';

import NewsItem from './NewsItem';
import styles from './styles.scss';

class NewsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      news
    } = this.props;
    return (
      <Tab.Pane attached={false}>
        <div className={styles.news_container}>
	  {
	    news.map((item, i) => {
	      return <NewsItem item={item} />;
	    })
	  }
	</div>
      </Tab.Pane>
    );
  }
}

export default NewsTab;

import React from 'react';
import { Dimmer, Loader, Tab } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';

import NewsItem from './NewsItem';
import styles from './styles.scss';

class NewsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { news } = this.props;

    return (
      <Tab.Pane attached={false}>
        <div className={styles.news_container}>
          {_(news)
            .sortBy('timestamp')
            .reverse()
            .value()
            .map((item, i) => {
              return <NewsItem key={'newsitem-' + i} item={item} />;
            })}
        </div>
      </Tab.Pane>
    );
  }
}

export default NewsTab;

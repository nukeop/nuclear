import React from 'react';
import { Tab } from 'semantic-ui-react';
import _ from 'lodash';

import NewsItem from './NewsItem';
import styles from './styles.scss';

const NewsTab = ({ news }) => (
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

export default NewsTab;

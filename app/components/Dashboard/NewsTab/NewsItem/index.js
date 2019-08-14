import React from 'react';
import moment from 'moment';

import styles from './styles.scss';

const NewsItem = ({ item }) => (
  <div className={styles.news_item}>
    <h1>{item.title}</h1>
    <h4>
      {moment.unix(item.timestamp).format('dddd, MMMM, Do YYYY, h:mm:ss A')}
    </h4>

    <p dangerouslySetInnerHTML={{ __html: item.body }} />

    <div className={styles.tags}>
      {item.tags.map((tag, i) => {
        return (
          <span key={'news-item-tag-' + i} className={styles.tag}>
            #{tag}
          </span>
        );
      })}
    </div>
  </div>
);

export default NewsItem;

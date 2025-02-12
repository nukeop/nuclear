import React from 'react';
import { SmoothImage } from '@nuclear/ui';
import classnames from 'classnames';
import _ from 'lodash';

import { LastfmImage } from '@nuclear/core/src/rest/Lastfm.types';

import styles from './styles.scss';

type TopListItem = {
  name: string;
  image: LastfmImage[];
}

type TagTopListProps = {
  topList: TopListItem[];
  onClick?: (name: string) => void;
  header: string;
}

const TagTopList: React.FC<TagTopListProps> = ({ topList=[], onClick, header }) => (
  <div className={styles.tag_top_list}>
    <h4>{header}</h4>
    <div className={styles.top_list_items}>
      <div
        className={styles.top_item}
        onClick={() => onClick?.(topList[0]?.name)}
      >
        <SmoothImage src={_.last(topList[0]?.image)?.['#text']} />
        <div className={styles.item_overlay}>
          <div className={styles.item_name}>{topList[0]?.name}</div>
        </div>
      </div>
      <div className={styles.other_items}>
        {topList.slice(1, 5).map((item, i) => (
          <div
            key={i}
            className={styles.other_item}
            onClick={() => onClick?.(item.name)}
          >
            <SmoothImage src={_.last(item.image)?.['#text']} />
            <div className={styles.item_overlay}>
              <div
                className={classnames(
                  styles.item_name,
                  styles.other_item_name
                )}
              >
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TagTopList;

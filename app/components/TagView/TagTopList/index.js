import React from 'react';
import Img from 'react-image-smooth-loading';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './styles.scss';

class TagTopList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      topList,
      onClick,
      header
    } = this.props;
    
    return(
      <div className={styles.tag_top_list}>
        <h4>{header}</h4>
        <div className={styles.top_list_items}>
          <div className={styles.top_item} onClick={() => onClick && onClick(topList[0].name)}>
            <Img src={_.last(topList[0].image)['#text']} />
            <div
              className={styles.item_overlay}
            >
              <div className={styles.item_name}>{topList[0].name}</div>
            </div>
          </div>
          <div className={styles.other_items}>
            {
              topList.slice(1, 5).map((item, i) => {
                return (
                  <div
                    key={i}
                    className={styles.other_item}
                    onClick={() => onClick && onClick(item.name)}
                  >
                    <Img src={_.last(item.image)['#text']}/>
                    <div className={styles.item_overlay}
                    >
                      <div className={classnames(styles.item_name, styles.other_item_name)}>{item.name}</div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default TagTopList;

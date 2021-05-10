import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

export const QueueBottomBar= ({
  addToDownloads,
  items,
  currentSong
}) => {

  const handleDownloads = () => {
    if ((currentSong !== null && currentSong >= 0) && (items !== null && items !== undefined && items.length > 0)) {
      addToDownloads(_.get(items, currentSong));
    }
  };

  const bottomBarOptions = [{
    link: '#',
    iconName: 'triangle left',
    onClickHandler: null
  },
  {
    link: '#',
    iconName: 'star',
    onClickHandler: null
  }, 
  {
    link: '#',
    iconName: 'download',
    onClickHandler: handleDownloads
  }];
  
  return (
    <div className={styles.queue_bottom_bar}>
      Current Track
      <hr/>
      <ul className={styles.bottom_options_container}>
        {bottomBarOptions.map((item, index) => {
          return (
            <li className={styles.bottom_option_item} key={index}>
              <a href={item.link} onClick={item.onClickHandler} draggable='false'>
                <Icon size='large' name={item.iconName}/>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

QueueBottomBar.propTypes = {
  addToDownloads: PropTypes.func,
  items: PropTypes.array,
  currentSong: PropTypes.number
};

QueueBottomBar.defaultProps = {
  addToDownloads: () => {},
  items: [],
  currentSong: 0
};

export default QueueBottomBar;

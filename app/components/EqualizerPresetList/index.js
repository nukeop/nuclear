import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';
import classNames from 'classnames';

import styles from './styles.scss';

const EqualizerPresetList = ({ presets, onClickItem, selected }) => (
  <List divided verticalAlign='middle' className={styles.equalizer_list}>
    {presets.map((preset, idx) => (
      <List.Item
        key={idx}
        onClick={() => preset !== selected && onClickItem(preset)}
        className={
          classNames(
            styles.equalizer_item,
            {
              [styles.equalizer_click_item]: preset !== selected
            })
        }
      >
        <List.Content floated='right'>
          {preset === selected && <Icon name='check' />}
        </List.Content>
        <List.Content>{preset}</List.Content>
      </List.Item>
    ))}
  </List>
);

EqualizerPresetList.propTypes = {
  presets: PropTypes.arrayOf(PropTypes.string),
  onClickItem: PropTypes.func,
  selected: PropTypes.string
};

export default EqualizerPresetList;

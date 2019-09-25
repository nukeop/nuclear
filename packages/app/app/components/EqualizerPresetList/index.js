import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';
import classNames from 'classnames';

import styles from './styles.scss';

const EqualizerPresetList = ({ presets, onClickItem, selected }) => (
  <div className={styles.preset_list_container}>
    <h3>Presets</h3>
    <List divided verticalAlign='middle' className={styles.equalizer_list}>
      {presets.map((preset, index) => (
        <List.Item
          key={index}
          onClick={() => preset !== selected && onClickItem(preset.id)}
          className={
            classNames(
              styles.equalizer_item,
              {
                [styles.equalizer_click_item]: preset.id !== selected
              })
          }
        >
          <List.Content floated='right'>
            {preset.id === selected && <Icon name='check' />}
          </List.Content>
          <List.Content>{preset.label}</List.Content>
        </List.Item>
      ))}
    </List>
  </div>
);

EqualizerPresetList.propTypes = {
  presets: PropTypes.array.isRequired,
  onClickItem: PropTypes.func,
  selected: PropTypes.string
};

export default EqualizerPresetList;

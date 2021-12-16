import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

type EqualizerPresetListProps ={
  presets: Array<Preset>;
  onClickItem: (x: string) => void;
  selected: string;
}

type Preset ={
  id : string;
  label : string;
  preAmp : number;
  values : Array<number>;

}

const EqualizerPresetList:React.FC<EqualizerPresetListProps> = ({ presets, onClickItem, selected }) => {
  const { t } = useTranslation('equalizer');
  
  return (
    <div className={styles.preset_list_container}>
      <h3>{t('presets')}</h3>
      <List divided verticalAlign='middle' className={styles.equalizer_list}>
        {presets.map((preset, index) => (
          <List.Item
            key={index}
            onClick={() => preset.id !== selected && onClickItem(preset.id)}
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
            <List.Content>{t(preset.label)}</List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default EqualizerPresetList;

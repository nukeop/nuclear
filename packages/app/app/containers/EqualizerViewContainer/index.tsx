import React, {useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as EqualizerActions from '../../actions/equalizer';
import Equalizer from '../../components/Equalizer';
import EqualizerPresetList from '../../components/EqualizerPresetList';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';
import { RootState } from '../../reducers';
import Header from '../../components/Header';

const usePresets = () => {
  const map = useSelector((state: RootState) => state.equalizer.presets);
  const ids = useSelector((state: RootState) => state.equalizer.presetIDs);
  return useMemo(() => denormalize({ids, map}), [ids, map]);
};

const denormalize = ({map, ids}) => ids.map(id => map[id]);

const EqualizerViewContainer: React.FC = () => {
  const equalizer = useSelector((state: RootState) => state.equalizer);
  const preset = equalizer.presets[equalizer.selected];
  const dispatch = useDispatch();
  const actions = useMemo(() => bindActionCreators(EqualizerActions, dispatch), [dispatch]);
  const presets = usePresets();
  const { t } = useTranslation('app');
  return (
    <div className={styles.equalizer_view}>
      <Header>{t('equalizer')}</Header>
      <div className={styles.equalizer_components}>
        <Equalizer
          values={preset.values}
          preAmp={preset.preAmp}
          onEqualizerChange={actions.changeValue}
          onPreampChange={actions.setPreAmp}
          onToggleSpectrum={actions.toggleSpectrum}
          enableSpectrum={equalizer.enableSpectrum}
          spectrum={equalizer.spectrum}
        />
        <EqualizerPresetList
          onClickItem={actions.selectPreset}
          presets={presets}
          selected={preset.id}
        />
      </div>
    </div>
  );
};

export default EqualizerViewContainer;

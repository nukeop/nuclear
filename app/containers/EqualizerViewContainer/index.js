import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as EqualizerActions from '../../actions/equalizer';
import Equalizer from '../../components/Equalizer';
import EqualizerPresetList from '../../components/EqualizerPresetList';

import styles from './styles.scss';

const EqualizerViewContainer = ({ actions, equalizer, presets, selected, viz, dataViz }) => (
  <div className={styles.equalizer_view}>
    <h1>Equalizer</h1>
    <div className={styles.equalizer_components}>
      <Equalizer
        values={equalizer.values}
        preAmp={equalizer.preAmp}
        onChange={actions.updateEqualizer}
        viz={viz}
        dataViz={dataViz}
        onToggleViz={actions.toggleVisualization}
      />
      <EqualizerPresetList
        onClickItem={actions.setEqualizer}
        presets={presets}
        selected={selected}
      />
    </div>
  </div>
);

function mapStateToProps({ equalizer }) {
  return {
    selected: equalizer.selected,
    equalizer: equalizer.presets[equalizer.selected],
    presets: Object.keys(equalizer.presets),
    viz: equalizer.viz,
    dataViz: equalizer.dataViz
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(EqualizerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EqualizerViewContainer);

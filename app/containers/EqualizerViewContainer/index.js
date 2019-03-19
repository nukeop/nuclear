import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as EqualizerActions from '../../actions/equalizer';
import Equalizer from '../../components/Equalizer';
import EqualizerPresetList from '../../components/EqualizerPresetList';

const EqualizerViewContainer = ({ actions, values, presets, selected }) => (
  <React.Fragment>
    <Equalizer
      values={values}
      onChange={actions.updateEqualizer}
    />
    <EqualizerPresetList
      onClickItem={actions.setEqualizer}
      presets={presets}
      selected={selected}
    />
  </React.Fragment>
);

function mapStateToProps({ equalizer }) {
  return {
    selected: equalizer.selected,
    values: equalizer.presets[equalizer.selected],
    presets: Object.keys(equalizer.presets)
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

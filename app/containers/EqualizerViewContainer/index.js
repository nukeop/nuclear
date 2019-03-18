import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Player from '../../actions/player';
import Equalizer from '../../components/Equalizer';

const EqualizerViewContainer = ({ actions, values }) => (
  <Equalizer
    values={values}
    onChange={actions.updateEqualizer}
  />
);

function mapStateToProps({ player }) {
  return {
    values: player.equalizer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Player, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EqualizerViewContainer);

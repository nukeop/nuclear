import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import LibraryView from '../../components/LibraryView';
import * as QueueActions from '../../actions/queue';
import * as LocalActions from '../../actions/local';

function mapStateToProps(state) {
  return {
    pending: state.local.pending,
    musicSources: state.plugin.plugins.musicSources.filter(({ sourceName }) => sourceName === 'Local'),
    byArtist: _.groupBy(Object.values(state.local.tracks), track => track.artist)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...QueueActions, ...LocalActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryView);

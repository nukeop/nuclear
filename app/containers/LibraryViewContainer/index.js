import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import _ from 'lodash';

import LibraryView from '../../components/LibraryView';
import * as LocalActions from '../../actions/local';

function mapStateToProps(state) {
  return {
    pending: state.local.pending,
    tracks: Object.values(state.local.tracks),
    localFolders: state.local.folders
    // byArtist: _.groupBy(Object.values(state.local.tracks), track => track.artist)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...LocalActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryView);

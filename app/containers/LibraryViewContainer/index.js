import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortBy } from 'lodash';

import LibraryView from '../../components/LibraryView';
import * as LocalActions from '../../actions/local';

function mapStateToProps(state) {
  const filteredTracks = Object.values(state.local.tracks)
    .filter(({ artist, name }) => artist.name.includes(state.local.filter) || name.includes(state.local.filter));

  let tracks;
  switch (state.local.sortBy) {
  case 'artist':
    tracks = sortBy(filteredTracks, track => track.artist.name);
    break;
  case 'name':
    tracks = sortBy(filteredTracks, track => track.name);
    break;
  default:
    tracks = filteredTracks;
    break;
  }

  return {
    pending: state.local.pending,
    tracks: state.local.direction === 'ascending' ? tracks : tracks.reverse(),
      
    localFolders: state.local.folders,
    sortBy: state.local.sortBy,
    direction: state.local.direction
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

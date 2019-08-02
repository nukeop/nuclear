import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import LibraryView from '../../components/LibraryView';
import * as LocalActions from '../../actions/local';
import * as SettingsActions from '../../actions/settings';

function mapStateToProps(state) {
  const lowercaseFilter = _.lowerCase(state.local.filter);
  const checkFilter = string => _.includes(_.lowerCase(string), lowercaseFilter);
  const filteredTracks = _.filter(_.values(state.local.tracks), track => {
    return _.some([
      checkFilter(track.name),
      checkFilter(track.album),
      checkFilter(_.get(track, 'artist.name'))
    ]);
  });
  
  let tracks;
  switch (state.local.sortBy) {
  case 'artist':
    tracks = _.sortBy(filteredTracks, track => track.artist.name);
    break;
  case 'name':
    tracks = _.sortBy(filteredTracks, track => track.name);
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
    direction: state.local.direction,
    api: state.settings['api.enabled']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...LocalActions, ...SettingsActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryView);

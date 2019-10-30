import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import LibraryView from '../../components/LibraryView';
import * as LocalActions from '../../actions/local';
import * as SettingsActions from '../../actions/settings';
import { sortTracks } from './utils';

function mapStateToProps(state) {
  const lowercaseFilter = _.lowerCase(state.local.filter);
  const checkFilter = string => _.includes(_.lowerCase(string), lowercaseFilter);
  const unfilteredTracks = _.values(state.local.tracks);
  const filteredTracks = _.filter(unfilteredTracks, track => {
    return _.some([
      checkFilter(track.name),
      checkFilter(track.album),
      checkFilter(_.get(track, 'artist.name'))
    ]);
  });

  let tracks = sortTracks(filteredTracks, state.local.sortBy);

  return {
    tracks: state.local.direction === 'ascending' ? tracks : tracks.reverse(),
    filterApplied: tracks.length < unfilteredTracks.length,

    pending: state.local.pending,
    scanProgress: state.local.scanProgress,
    scanTotal: state.local.scanTotal,

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

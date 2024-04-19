import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LibraryView from '../../components/LibraryView';
import { 
  localLibraryActions,
  openLocalFolderPicker
} from '../../actions/local';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as SettingsActions from '../../actions/settings';

function mapStateToProps(state) {
  return {
    tracksMap: state.local.tracks,
    filter: state.local.filter,
    expandedFolders: state.local.expandedFolders,
    streamProviders: state.plugin.plugins.streamProviders,

    pending: state.local.pending,
    scanProgress: state.local.scanProgress,
    scanTotal: state.local.scanTotal,

    localFolders: state.local.folders,
    sortBy: state.local.sortBy,
    direction: state.local.direction,
    listType: state.local.listType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ 
      ...localLibraryActions, 
      ...SettingsActions,
      openLocalFolderPicker
    }, dispatch),
    queueActions: bindActionCreators(QueueActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryView);

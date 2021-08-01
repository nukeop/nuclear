import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clipboard } from 'electron';
import { compose, withHandlers } from 'recompose';
import * as QueueActions from '../../actions/queue';

import QueuePopup from '../../components/PlayQueue/QueuePopup';

const mapStateToProps = state => ({
  plugins: state.plugin
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, QueueActions), dispatch)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    copyToClipboard: () => (text) => {
      if (text?.length) {
        clipboard.writeText(text);
      }
    }
  })
)(QueuePopup);

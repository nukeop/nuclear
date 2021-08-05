import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import { withState, withHandlers, withProps, compose } from 'recompose';
import { Popup } from 'semantic-ui-react';
import { StreamInfo } from '@nuclear/ui';

import styles from './styles.scss';
import QueuePopupButtons from '../../../containers/QueuePopupButtons';

export const QueuePopup = ({
  trigger,
  isQueueItemCompact,
  idLabel,
  isOpen,
  handleClose,
  imageReady,
  setImageReady,
  setOpen,
  titleLabel,
  copyTrackUrlLabel,
  sourceLabel,
  track,
  index,
  actions,
  plugins,
  selectedStream,
  copyToClipboard
}) => {
  const triggerElement = useRef(null);
  
  const handleOpen = useCallback(
    event => {
      event.preventDefault();
      if (!selectedStream) {
        return;
      }
      triggerElement.current.click();
      setOpen(true);
    },
    [selectedStream, setOpen]
  );

  const handleImageLoaded = useCallback(() => setImageReady(true), [setImageReady]);

  const handleRerollTrack = track => {
    const selectedStreamProvider = _.find(plugins.plugins.streamProviders, { sourceName: plugins.selected.streamProviders });
    actions.rerollTrack(selectedStreamProvider, selectedStream, track);
  };

  const handleSelectStream = ({ track, stream }) => {
    actions.changeTrackStream(track, stream);
  };

  const handleCopyTrackUrl = useCallback(() => {
    if (selectedStream?.originalUrl?.length) {
      copyToClipboard(selectedStream.originalUrl);
    }
    handleClose();
  }, [selectedStream, handleClose, copyToClipboard]);

  const dropdownOptions = _.map(plugins.plugins.streamProviders, s => ({
    key: s.sourceName,
    text: s.sourceName,
    value: s.sourceName,
    content: s.sourceName
  }));

  return (
    <Popup
      className={cs(styles.queue_popup, {
        [styles.hidden]: !imageReady
      })}
      trigger={
        <div
          ref={triggerElement}
          data-testid={`queue-popup-${track.uuid}`}
          onContextMenu={handleOpen}
        >
          {trigger}
        </div>
      }
      open={isOpen}
      onClose={handleClose}
      position={isQueueItemCompact ? 'bottom right' : 'bottom center'}
      hideOnScroll
      on={null}
      popperModifiers={{ preventOverflow: { boundariesElement: 'window' } }}
    >
      <StreamInfo
        dropdownOptions={dropdownOptions}
        idLabel={idLabel}
        titleLabel={titleLabel}
        copyTrackUrlLabel={copyTrackUrlLabel}
        sourceLabel={sourceLabel}
        selectedStream={selectedStream}
        track={track}
        onRerollTrack={handleRerollTrack}
        onSelectStream={handleSelectStream}
        onImageLoaded={handleImageLoaded}
        onCopyTrackUrl={handleCopyTrackUrl}
      />
      <hr />
      <div className={styles.queue_popup_buttons_container}>
        <QueuePopupButtons track={track} index={index} />
      </div>
    </Popup>
  );
};

QueuePopup.propTypes = {
  trigger: PropTypes.node.isRequired,
  isQueueItemCompact: PropTypes.bool,
  idLabel: PropTypes.string,
  titleLabel: PropTypes.string,
  copyTrackUrlLabel: PropTypes.string,
  sourceLabel: PropTypes.string,
  track: PropTypes.object,
  index: PropTypes.number,
  actions: PropTypes.object,
  plugins: PropTypes.object,
  copyToClipboard: PropTypes.func
};

export default compose(
  withState('isOpen', 'setOpen', false),
  withState('imageReady', 'setImageReady', false),
  withHandlers({
    handleClose: ({ setOpen }) => () => setOpen(false)
  }),
  withProps(({ track, plugins }) => ({
    selectedStream: _.find(track.streams, { source: plugins.selected.streamProviders })
  }))
)(QueuePopup);

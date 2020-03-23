import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
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
  track,
  index,
  actions,
  plugins,
  selectedStream
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
        <div ref={triggerElement} onContextMenu={handleOpen}>
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
        selectedStream={selectedStream}
        track={track}
        onRerollTrack={handleRerollTrack}
        onSelectStream={handleSelectStream}
        onImageLoaded={handleImageLoaded}
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
  track: PropTypes.object,
  index: PropTypes.number,
  actions: PropTypes.object,
  plugins: PropTypes.object
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

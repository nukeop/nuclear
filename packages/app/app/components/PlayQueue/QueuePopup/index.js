import React, { useRef, useCallback } from 'react';
import cs from 'classnames';
import { withState, withHandlers, compose } from 'recompose';
import { Popup } from 'semantic-ui-react';
import { StreamInfo } from '@nuclear/ui';

import styles from './styles.scss';
import TrackPopupButtons from '../../../containers/TrackPopupButtons';

export const QueuePopup = ({
  trigger,
  dropdownOptions,
  idLabel,
  isOpen,
  handleClose,
  imageReady,
  selectedStream,
  setImageReady,
  setOpen,
  setTarget,
  target,
  titleLabel,
  track,
  onRerollTrack,
  onSelectStream
}) => {
  const triggerElement = useRef(null);

  const handleOpen = useCallback(
    event => {
      event.preventDefault();
      triggerElement.current.click();
      const { left, top } = triggerElement.current.getBoundingClientRect();
      setTarget({
        ...target,
        itemX: left,
        itemY: top,
        itemHeight: triggerElement.current.offsetHeight
      });
      setOpen(true);
    },
    [triggerElement, setOpen, setTarget, target]
  );

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
      hideOnScroll
      position='right center'
      on={null}
      style={
        target && {
          transform: `translate3d(${Math.round(target.x)}px, ${Math.round(
            target.y
          )}px, 0px)`
        }
      }
    >
      <StreamInfo
        dropdownOptions={dropdownOptions}
        idLabel={idLabel}
        titleLabel={titleLabel}
        setImageReady={setImageReady}
        selectedStream={selectedStream}
        target={target}
        setTarget={setTarget}
        track={track}
        onRerollTrack={onRerollTrack}
        onSelectStream={onSelectStream}
      />
      <hr />
      <div className={styles.queue_popup_buttons_container}>
        <TrackPopupButtons track={track} withAddToQueue={false} />
      </div>
    </Popup>
  );
};

export default compose(
  withState('target', 'setTarget', {
    x: 0,
    y: 0,
    itemX: 0,
    itemY: 0,
    itemHeight: 0
  }),
  withState('isOpen', 'setOpen', false),
  withState('imageReady', 'setImageReady', false),
  withHandlers({
    handleClose: ({ setOpen }) => () => setOpen(false)
  })
)(QueuePopup);

import React, { useRef, useCallback } from 'react';
import Img from 'react-image';
import cs from 'classnames';
import { withState, withHandlers, compose } from 'recompose';
import { Icon, Dropdown, Popup } from 'semantic-ui-react';

import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';

const POPUP_MARGIN = 15;

export const QueuePopup = ({
  trigger,
  dropdownOptions,
  idLabel,
  isOpen,
  handleClose,
  handleRerollTrack,
  handleSelectStream,
  imageReady,
  selectedStream,
  setImageReady,
  setOpen,
  setTarget,
  target,
  titleLabel,
  track
}) => {
  const triggerElement = useRef(null);
  const popupElement = useRef(null);

  const handleOpen = useCallback((event) => {
    event.preventDefault();
    triggerElement.current.click();
    const { left, top } = triggerElement.current.getBoundingClientRect();
    setTarget({ itemX: left, itemY: top, itemHeight: triggerElement.current.offsetHeight });
    setOpen(true);
  }, [triggerElement, setOpen, setTarget]);

  const handleImageLoaded = useCallback(() => {
    setImageReady(true);
    const popupWrapper = popupElement.current.parentElement;
    const { width: popupWidth } = popupWrapper.getBoundingClientRect();
    setTarget({
      x: target.itemX - popupWidth - POPUP_MARGIN,
      y: target.itemY - popupWrapper.offsetHeight / 2 + target.itemHeight / 2
    });
  }, [popupElement, setImageReady, setTarget, target]);

  if (!!track.local || !(track.streams && selectedStream)) {
    return trigger;
  }

  return (
    <Popup
      className={cs(styles.queue_popup, {
        [styles.hidden]: !imageReady
      })}
      trigger={<div ref={triggerElement} onContextMenu={handleOpen}>{trigger}</div>}
      open={isOpen}
      onClose={handleClose}
      hideOnScroll
      position='right center'
      on={null}
      style={target && {
        transform: `translate3d(${Math.round(target.x)}px, ${Math.round(target.y)}px, 0px)`
      }}
    >
      <div className={styles.stream_info} ref={popupElement}>
        <div className={styles.stream_thumbnail}>
          <Img
            alt=''
            src={selectedStream.thumbnail || track.thumbnail}
            unloader={<img src={artPlaceholder} />}
            onLoad={handleImageLoaded}
          />
        </div>
        <div className={styles.stream_text_info}>
          <div className={styles.stream_source}>
            <label>Source:</label>{' '}
            <Dropdown
              inline
              options={dropdownOptions}
              defaultValue={_.get(
                _.find(dropdownOptions, o => o.value === selectedStream.source),
                'value'
              )}
              onChange={handleSelectStream}
            />
          </div>
          <div className={styles.stream_title}>
            <label>{titleLabel}</label>
            <span>{selectedStream.title}</span>
          </div>
          {selectedStream.id && (
            <div className={styles.stream_id}>
              <label>{idLabel}</label>
              <span>{selectedStream.id}</span>
            </div>
          )}
        </div>
        <div className={styles.stream_buttons}>
          <a href='#' onClick={handleRerollTrack}>
            <Icon name='refresh' />
          </a>
        </div>
      </div>
    </Popup>
  );
};

export default compose(
  withState('target', 'setTarget', { x: 0, y: 0, itemX: 0, itemY: 0, itemHeight: 0 }),
  withState('isOpen', 'setOpen', false),
  withState('imageReady', 'setImageReady', false),
  withHandlers({
    handleClose: ({ setOpen }) => () => setOpen(false),
    handleRerollTrack: ({ onRerollTrack, track }) => (event) => {
      event.preventDefault();
      onRerollTrack(track);
    },
    handleSelectStream: ({ onSelectStream, track }) => (evt, { value }) => {
      onSelectStream({ track, stream: value });
    }
  })
)(QueuePopup);

import React from 'react';
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
  handleOpen,
  handleRerollTrack,
  handleImageLoaded,
  imageReady,
  selectedStream,
  target,
  titleLabel,
  track
}) => {
  if (!!track.local || !(track.streams && selectedStream)) {
    return trigger;
  }

  return (
    <Popup
      className={cs(styles.queue_popup, {
        [styles.hidden]: !imageReady
      })}
      trigger={<div onContextMenu={handleOpen}>{trigger}</div>}
      open={isOpen}
      onClose={handleClose}
      hideOnScroll
      position='right center'
      on={null}
      style={target && {
        transform: `translate3d(${target.x}px, ${target.y}px, 0px)`
      }}
    >
      <div className={styles.stream_info}>
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
              defaultValue={
                _.get(
                  _.find(dropdownOptions, o => o.value === selectedStream.source),
                  'value'
                )
              }
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
    handleImageLoaded: ({ setImageReady, setTarget, target }) => () => {
      setImageReady(true);
      const popupElement = document.querySelector('.queue_popup');
      const { width: popupWidth } = popupElement.getBoundingClientRect();

      setTarget({
        x: target.itemX - popupWidth - POPUP_MARGIN,
        y: target.itemY - popupElement.offsetHeight / 2 + target.itemHeight / 2
      });
    },
    handleRerollTrack: ({ onRerollTrack, track, setOpen }) => (event) => {
      event.preventDefault();
      onRerollTrack(track);
      setOpen(false);
      setOpen(true);
    },
    handleOpen: ({ setOpen, setTarget }) => event => {
      event.persist();
      event.preventDefault();
      setOpen(true);

      const itemElement = event.target.closest('.queue_item');
      const { left, top } = itemElement.getBoundingClientRect();

      setTarget({ itemX: left, itemY: top, itemHeight: itemElement.offsetHeight });
    }
  })
)(QueuePopup);

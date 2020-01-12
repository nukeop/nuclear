import React from 'react';
import { withState, withHandlers, compose } from 'recompose';
import { Icon, Dropdown, Popup } from 'semantic-ui-react';

import Img from 'react-image';
import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';

export const QueuePopup = ({
  trigger,
  dropdownOptions,
  idLabel,
  isOpen,
  handleClose,
  handleOpen,
  handleTriggerClick,
  handleRerollTrack,
  handleChangeStream,
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
      className={styles.queue_popup}
      trigger={<div onClick={handleTriggerClick}>{trigger}</div>}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      hideOnScroll
      position='right center'
      on='click'
      style={target && {
        transform: `translate3d(${target.x}px, ${target.y}px, 0px)`
      }}
    >
      <div className={styles.stream_info}>
        <div className={styles.stream_thumbnail}>
          <Img
            alt=''
            src={selectedStream.thumbnail}
            unloader={<img src={artPlaceholder} />}
          />
        </div>
        <div className={styles.stream_text_info}>
          <div className={styles.stream_source}>
            <label>Source:</label>{' '}
            <Dropdown
              inline
              options={dropdownOptions}
              onChange={handleChangeStream}
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
  withState('target', 'setTarget', { x: 0, y: 0 }),
  withState('isOpen', 'setOpen', false),
  withState('stream', 'setStream', 'Youtube'),
  withHandlers({
    handleOpen: ({setOpen}) => () => setOpen(true),
    handleClose: ({setOpen}) => () => setOpen(false),
    handleChangeStream: ({ setStream }) => (_, { value }) => setStream(value),
    handleRerollTrack: ({ onRerollTrack, track, stream }) => () => onRerollTrack(track, stream),
    handleTriggerClick: ({ setTarget }) => e => {
      const { left, top, width } = e.target.closest('.queue_item').getBoundingClientRect();

      setTarget({ x: left - width + 20, y: top - 45 });
    }
  })
)(QueuePopup);

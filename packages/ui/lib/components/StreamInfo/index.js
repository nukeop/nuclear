import React, { useCallback, useRef } from 'react';
import Img from 'react-image';
import { Dropdown, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { withHandlers } from 'recompose';

const POPUP_MARGIN = 15;

const StreamInfo = ({
  selectedStream,
  handleRerollTrack,
  handleSelectStream,
  track,
  dropdownOptions,
  idLabel,
  titleLabel,
  setImageReady,
  setTarget,
  target
}) => {
  const popupElement = useRef(null);
  const handleImageLoaded = useCallback(() => {
    setImageReady(true);
    const popupWrapper = popupElement.current.parentElement;
    const { width: popupWidth } = popupWrapper.getBoundingClientRect();

    setTarget({
      ...target,
      x: target.itemX - popupWidth - POPUP_MARGIN,
      y: target.itemY - popupWrapper.offsetHeight / 2 + target.itemHeight / 2
    });
  }, [popupElement, setImageReady, setTarget, target]);
  return (
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
  );
};

StreamInfo.propTypes = {
  selectedStream: PropTypes.object.isRequired,
  handleRerollTrack: PropTypes.func,
  handleSelectStream: PropTypes.func,
  track: PropTypes.object.isRequired,
  dropdownOptions: PropTypes.array,
  idLabel: PropTypes.string,
  titleLabel: PropTypes.string,
  setImageReady: PropTypes.func,
  setTarget: PropTypes.func,
  target: PropTypes.object
};

export default withHandlers({
  handleClose: ({ setOpen }) => () => setOpen(false),
  handleRerollTrack: ({ onRerollTrack, track }) => event => {
    event.preventDefault();
    onRerollTrack(track);
  },
  handleSelectStream: ({ onSelectStream, track }) => (evt, { value }) => {
    onSelectStream({ track, stream: value });
  }
})(StreamInfo);

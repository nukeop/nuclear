import React from 'react';
import Img from 'react-image';
import { Dropdown, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { withHandlers } from 'recompose';
import Tooltip from '../Tooltip';

const StreamInfo = ({
  selectedStream,
  handleRerollTrack,
  handleSelectStream,
  handleImageLoaded,
  handleCopyTrackUrl,
  track,
  dropdownOptions,
  idLabel,
  titleLabel,
  copyTrackUrlLabel,
  sourceLabel
}) => {
  return (
    <div className={styles.stream_info}>
      <div className={styles.stream_thumbnail}>
        <Img
          alt=''
          src={_.get(selectedStream, 'thumbnail') || _.get(track, 'thumbnail')}
          unloader={<img src={artPlaceholder} />}
          onLoad={handleImageLoaded}
        />
      </div>
      <div className={styles.stream_text_info}>
        <div className={styles.stream_source}>
          <label>{sourceLabel}</label>{' '}
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
        {selectedStream.originalUrl && (
          <Tooltip
            on='hover'
            content={copyTrackUrlLabel}
            trigger={<a href='#' data-testid='copy-original-url' onClick={handleCopyTrackUrl}>
              <Icon name='linkify' />
            </a>}
          />
          
        )}
        <a href='#' onClick={handleRerollTrack}>
          <Icon name='refresh' />
        </a>
      </div>
    </div>
  );
};

StreamInfo.propTypes = {
  selectedStream: PropTypes.object.isRequired,
  track: PropTypes.object.isRequired,
  dropdownOptions: PropTypes.array,
  idLabel: PropTypes.string,
  titleLabel: PropTypes.string,
  copyTrackUrlLabel: PropTypes.string,
  sourceLabel: PropTypes.string
};

export default withHandlers({
  handleClose: ({ setOpen }) => () => setOpen(false),
  handleRerollTrack: ({ onRerollTrack, track }) => event => {
    event.preventDefault();
    onRerollTrack(track);
  },
  handleSelectStream: ({ onSelectStream, track }) => (evt, { value }) => {
    onSelectStream({ track, stream: value });
  },
  handleImageLoaded: ({ onImageLoaded }) => () => {
    onImageLoaded();
  },
  handleCopyTrackUrl: ({ onCopyTrackUrl }) => () => {
    onCopyTrackUrl();
  }
})(StreamInfo);

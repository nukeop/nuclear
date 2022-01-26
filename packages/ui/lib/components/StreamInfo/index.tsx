import React, { memo } from 'react';
import Img from 'react-image';
import { Dropdown, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import Tooltip from '../Tooltip';

import styles from './styles.scss';

const StreamInfo = (props: StreamInfoProps & Handlers) => {

  const { selectedStream,
    handleRerollTrack,
    handleSelectStream,
    handleImageLoaded,
    handleCopyTrackUrl,
    track,
    dropdownOptions,
    idLabel,
    titleLabel,
    copyTrackUrlLabel,
    sourceLabel } = props;

  return (
    <>
      <div className={styles.stream_info}>
        <div className={styles.stream_thumbnail}>
          <Img
            alt=''
            src={_.get(selectedStream, 'thumbnail') || _.get(track, 'thumbnail')}
            unloader={<img src={String(artPlaceholder)} />}
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
          {selectedStream.id ? (
            <div className={styles.stream_id}>
              <label>{idLabel}</label>
              <span>{selectedStream.id}</span>
            </div>
          ) : null}
        </div>
        <div className={styles.stream_buttons}>
          {selectedStream.originalUrl ? (
            <Tooltip
              on='hover'
              content={copyTrackUrlLabel}
              trigger={
                <a href='#' data-testid='copy-original-url' onClick={handleCopyTrackUrl}>
                  <Icon name='linkify' />
                </a>
              }
            />
          ) : null}
          <a href='#' onClick={handleRerollTrack}>
            <Icon name='refresh' />
          </a>
        </div>
      </div>
    </>
  );
};

type SkipSegments = {
  category?: string,
  endTime?: number,
  startTime?: number
}

type SelectedStream = {
  duration?: number,
  format?: string,
  id?: string,
  originalUrl?: string,
  source?: string,
  stream?: string,
  thumbnail?: string,
  title?: string,
  skipSegments?: SkipSegments[],
}

type DropdownProps = {
  [key: string]: any
}

type Track = {
  artist?: string,
  name?: string
  thumbnail?: string,
  uuid?: string,
  loading?: boolean,
}

type RequiredProps = {
  selectedStream: SelectedStream,
  track: Track,
};

type DefaultProps = {
  dropdownOptions: DropdownProps[],
  idLabel: string,
  titleLabel: string,
  copyTrackUrlLabel: string,
  sourceLabel: string
};

type Handlers = {
  handleRerollTrack: React.MouseEventHandler<HTMLAnchorElement>,
  handleSelectStream: () => void,
  handleImageLoaded: () => any,
  handleCopyTrackUrl: () => void,
}

type StreamInfoProps = RequiredProps & DefaultProps;

export default memo(StreamInfo);

import React, { memo } from 'react';
import Img from 'react-image';
import { Dropdown, Icon } from 'semantic-ui-react';

import { SelectedStream } from '../../types';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import Tooltip from '../Tooltip';

import styles from './styles.scss';

const StreamInfo = (props: StreamInfoProps & Handlers) => {
  const { 
    selectedStream,
    onRerollTrack,
    onSelectStream,
    onImageLoaded,
    onCopyTrackUrl,
    thumbnail,
    dropdownOptions,
    idLabel,
    titleLabel,
    copyTrackUrlLabel,
    sourceLabel 
  } = props;

  return (
    <>
      <div className={styles.stream_info}>
        <div className={styles.stream_thumbnail}>
          <Img
            alt=''
            src={selectedStream?.thumbnail ?? thumbnail}
            unloader={<img src={String(artPlaceholder)} />}
            onLoad={onImageLoaded}
          />
        </div>
        <div className={styles.stream_text_info}>
          <div className={styles.stream_source}>
            <label>{sourceLabel}</label>{' '}
            <Dropdown
              data-testid='stream-info-dropdown'
              inline
              options={dropdownOptions}
              defaultValue={dropdownOptions.find(o => o.value === selectedStream.source)?.value}
              onChange={(e, data) => onSelectStream(data.value as string)}
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
                <a href='#' data-testid='copy-original-url' onClick={onCopyTrackUrl}>
                  <Icon name='linkify' />
                </a>
              }
            />
          ) : null}
          <a 
            href='#' 
            onClick={onRerollTrack}
          >
            <Icon name='refresh' />
          </a>
        </div>
      </div>
    </>
  );
};

type DropdownProps = {
  [key: string]: any
}

type RequiredProps = {
  selectedStream: SelectedStream,
  thumbnail: string | undefined,
};

type DefaultProps = {
  dropdownOptions: DropdownProps[],
  idLabel: string,
  titleLabel: string,
  copyTrackUrlLabel: string,
  sourceLabel: string
};

type Handlers = {
  onRerollTrack: React.MouseEventHandler<HTMLAnchorElement>;
  onSelectStream: (streamKey: string) => void;
  onImageLoaded: React.ReactEventHandler<HTMLImageElement>;
  onCopyTrackUrl: () => void;
}

type StreamInfoProps = RequiredProps & DefaultProps;

export default memo(StreamInfo);

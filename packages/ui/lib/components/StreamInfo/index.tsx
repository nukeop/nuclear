import React, { memo } from 'react';
import Img from 'react-image';
import { StreamData } from '@nuclear/core/src/plugins/plugins.types';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import Tooltip from '../Tooltip';

import styles from './styles.scss';
import Button from '../Button';

type Handlers = {
  onImageLoaded: React.ReactEventHandler<HTMLImageElement>;
  onCopyTrackUrl: () => void;
}

type StreamInfoProps = {
  selectedStream: StreamData;
  thumbnail?: string;
  copyTrackUrlLabel: string;
}

const StreamInfo = (props: StreamInfoProps & Handlers) => {
  const { 
    selectedStream,
    onImageLoaded,
    onCopyTrackUrl,
    thumbnail,
    copyTrackUrlLabel
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
          <div className={styles.stream_title}>
            {selectedStream?.title}
          </div>
          <div className={styles.stream_author}>
            {selectedStream?.author?.name}
          </div>
          {selectedStream?.id ? (
            <div className={styles.stream_id}>
              <span>{selectedStream?.id}</span>
              <Tooltip 
                on='hover'
                content={copyTrackUrlLabel}
                trigger={
                  <Button 
                    circular
                    basic
                    borderless
                    icon='clone'
                    onClick={onCopyTrackUrl}
                  />
                }
              />
            </div>
          ) : null}
          <div className={styles.spacer} />
          <div className={styles.stream_source}>
            <span>
              {selectedStream.source}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(StreamInfo);

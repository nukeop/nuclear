import React, { memo } from 'react';
import Img from 'react-image';

import { StreamData } from '@nuclear/core/src/plugins/plugins.types';

import { Dropdown } from '../..';
import { StreamOption } from './StreamOption';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import Tooltip from '../Tooltip';
import Button from '../Button';
import styles from './styles.scss';

type Handlers = {
  onImageLoaded: React.ReactEventHandler<HTMLImageElement>;
  onCopyTrackUrl: () => void;
  onSelectStream: (stream: StreamData) => void;
}

type StreamInfoProps = {
  streams: StreamData[];
  selectedStream: StreamData;
  thumbnail?: string;
  copyTrackUrlLabel: string;
}

const StreamInfo: React.FC<StreamInfoProps & Handlers> =({
  streams,
  selectedStream,
  onSelectStream,
  onImageLoaded,
  onCopyTrackUrl,
  thumbnail,
  copyTrackUrlLabel
}) => {
  const options = streams.map(stream => ({
    text: stream.title,
    value: stream.id,
    content: <StreamOption {...stream} />
  }));

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
          <Dropdown
            className={styles.stream_title}
            search
            selection
            options={options}
            defaultValue={selectedStream?.id}
            onChange={(e, { value }) => onSelectStream(streams.find(stream => stream.id === value))}
          />
          <div className={styles.stream_author}>
            {selectedStream?.author?.name}
          </div>
          {selectedStream?.id && 
          selectedStream?.originalUrl && (
            <div className={styles.stream_id}>
              <span>{selectedStream?.id}</span>
              <Tooltip 
                on='hover'
                content={copyTrackUrlLabel}
                trigger={
                  <Button
                    data-testid='copy-original-url'
                    circular
                    basic
                    borderless
                    icon='clone'
                    onClick={onCopyTrackUrl}
                  />
                }
              />
            </div>
          )}
          <div className={styles.spacer} />
          <div className={styles.stream_source}>
            <span className={styles.stream_source_name}>
              {selectedStream.source}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(StreamInfo);

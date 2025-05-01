import React, { useRef, useCallback, useState, memo } from 'react';
import cs from 'classnames';
import { head } from 'lodash';
import { Popup } from 'semantic-ui-react';

import { StreamData } from '@nuclear/core/src/plugins/plugins.types';
import { StreamInfo } from '@nuclear/ui';

import QueuePopupButtons from '../../../containers/QueuePopupButtons';
import { QueueItem } from '../../../reducers/queue';
import * as QueueActions from '../../../actions/queue';
import styles from './styles.scss';
import { PluginsState } from '../../../reducers/plugins';

export type QueuePopupProps = {
  trigger: React.ReactNode;
  isQueueItemCompact: boolean;

  copyTrackUrlLabel: string;

  track: QueueItem;
  index: number;

  plugins: PluginsState;
  copyToClipboard: (text: string) => void;
  onSelectStream: (stream: StreamData) => void;
  isOpen: boolean;
  onRequestOpen: () => void;
  onRequestClose: () => void;
}

export const QueuePopup: React.FC<QueuePopupProps> = ({
  trigger,
  isQueueItemCompact,
  copyTrackUrlLabel,
  track,
  index,
  copyToClipboard,
  onSelectStream,
  isOpen,
  onRequestOpen,
  onRequestClose
}) => {
  const triggerElement = useRef(null);
  const [imageReady, setImageReady] = useState(() => !track.loading && Boolean(track.thumbnail));

  const selectedStream = head(track.streams) as StreamData;

  const handleOpen = useCallback(
    event => {
      event.preventDefault();
      if (!selectedStream) {
        return;
      }
      triggerElement.current.click();
      onRequestOpen();
    },
    [selectedStream, onRequestOpen]
  );

  const handleImageLoaded = useCallback(() => setImageReady(true), [setImageReady]);

  const handleCopyTrackUrl = useCallback(() => {
    if (selectedStream?.originalUrl?.length) {
      copyToClipboard(selectedStream.originalUrl);
    }
    onRequestClose();
  }, [selectedStream, copyToClipboard, onRequestClose]);

  const handleSelectStream = useCallback((stream: StreamData) => {
    onSelectStream(stream);
    onRequestClose();
  }, [onSelectStream, onRequestClose]);

  return (
    <Popup
      data-testid={`queue-popup-${track.uuid}`}
      className={cs(styles.queue_popup, {
        [styles.hidden]: !imageReady
      })}
      trigger={
        <div
          ref={triggerElement}
          data-testid={`queue-popup-trigger-${track.uuid}`}
          onContextMenu={handleOpen}
        >
          {trigger}
        </div>
      }
      open={isOpen}
      onClose={onRequestClose}
      position={isQueueItemCompact ? 'bottom right' : 'bottom center'}
      hideOnScroll
      on={null}
    >
      <StreamInfo
        copyTrackUrlLabel={copyTrackUrlLabel}
        streams={track.streams as StreamData[]}
        selectedStream={selectedStream}
        thumbnail={track.thumbnail}
        onImageLoaded={handleImageLoaded}
        onCopyTrackUrl={handleCopyTrackUrl}
        onSelectStream={handleSelectStream}
      />
      <hr />
      <div className={styles.queue_popup_buttons_container}>
        <QueuePopupButtons track={track} index={index} />
      </div>
    </Popup>
  );
};

export default memo(QueuePopup);

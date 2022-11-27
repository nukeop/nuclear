import React, { useRef, useCallback, useState } from 'react';
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

type QueuePopupProps = {
  trigger: React.ReactNode;
  isQueueItemCompact: boolean;

  copyTrackUrlLabel: string;

  track: QueueItem;
  index: number;

  actions: typeof QueueActions;
  plugins: PluginsState;
  copyToClipboard: (text: string) => void;
  onSelectStream: (stream: StreamData) => void;
}

export const QueuePopup: React.FC<QueuePopupProps> = ({
  trigger,
  isQueueItemCompact,
  copyTrackUrlLabel,
  track,
  index,
  copyToClipboard,
  onSelectStream
}) => {
  const triggerElement = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  const selectedStream = head(track.streams) as StreamData;

  const handleOpen = useCallback(
    event => {
      event.preventDefault();
      if (!selectedStream) {
        return;
      }
      triggerElement.current.click();
      setIsOpen(true);
    },
    [selectedStream, setIsOpen]
  );

  const handleImageLoaded = useCallback(() => setImageReady(true), [setImageReady]);

  const handleCopyTrackUrl = useCallback(() => {
    if (selectedStream?.originalUrl?.length) {
      copyToClipboard(selectedStream.originalUrl);
    }
    setIsOpen(false);
  }, [selectedStream, setIsOpen, copyToClipboard]);

  const handleSelectStream = useCallback((stream: StreamData) => {
    onSelectStream(stream);
    setIsOpen(false);
  }, [onSelectStream]);

  return (
    <Popup
      className={cs(styles.queue_popup, {
        [styles.hidden]: !imageReady
      })}
      trigger={
        <div
          ref={triggerElement}
          data-testid={`queue-popup-${track.uuid}`}
          onContextMenu={handleOpen}
        >
          {trigger}
        </div>
      }
      open={isOpen}
      onClose={() => setIsOpen(false)}
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

export default QueuePopup;

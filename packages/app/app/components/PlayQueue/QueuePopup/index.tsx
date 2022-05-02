import React, { useRef, useCallback, useState } from 'react';
import cs from 'classnames';
import { Popup } from 'semantic-ui-react';

import { StreamInfo } from '@nuclear/ui';

import QueuePopupButtons from '../../../containers/QueuePopupButtons';
import { QueueItem } from '../../../reducers/queue';
import * as QueueActions from '../../../actions/queue';
import styles from './styles.scss';
import { PluginsState } from '../../../reducers/plugins';
import { StreamData } from '@nuclear/core/src/plugins/plugins.types';


type QueuePopupProps = {
trigger: React.ReactNode;
isQueueItemCompact: boolean;

idLabel: string;
titleLabel: string;
copyTrackUrlLabel: string;
sourceLabel: string;

track: QueueItem;
index: number;

actions: typeof QueueActions;
plugins: PluginsState;
copyToClipboard: (text: string) => void;
}

export const QueuePopup: React.FC<QueuePopupProps> = ({
  trigger,
  isQueueItemCompact,
  idLabel,
  titleLabel,
  copyTrackUrlLabel,
  sourceLabel,
  track,
  index,
  actions,
  plugins,
  copyToClipboard
}) => {
  const triggerElement = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  const selectedStream = track.stream as StreamData;

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

  const handleSelectStream = (streamProviderName: string) => {
    actions.switchStreamProvider({item: track, streamProviderName});
  };

  const handleCopyTrackUrl = useCallback(() => {
    if (selectedStream?.originalUrl?.length) {
      copyToClipboard(selectedStream.originalUrl);
    }
    setIsOpen(false);
  }, [selectedStream, setIsOpen, copyToClipboard]);

  const dropdownOptions = plugins.plugins.streamProviders.map(s => ({
    key: s.sourceName,
    text: s.sourceName,
    value: s.sourceName,
    content: s.sourceName
  }));

  const handleReroll = useCallback(() => {
    actions.rerollTrack(track);
    setIsOpen(false);
  }, [track, actions, setIsOpen]);

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
        dropdownOptions={dropdownOptions}
        idLabel={idLabel}
        titleLabel={titleLabel}
        copyTrackUrlLabel={copyTrackUrlLabel}
        sourceLabel={sourceLabel}
        selectedStream={selectedStream}
        thumbnail={track.thumbnail}
        onRerollTrack={handleReroll}
        onSelectStream={handleSelectStream}
        onImageLoaded={handleImageLoaded}
        onCopyTrackUrl={handleCopyTrackUrl}
      />
      <hr />
      <div className={styles.queue_popup_buttons_container}>
        <QueuePopupButtons track={track} index={index} />
      </div>
    </Popup>
  );
};

export default QueuePopup;

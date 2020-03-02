import React, { useRef, useCallback } from 'react';
import cs from 'classnames';
import { withState, withHandlers, compose } from 'recompose';
import { Popup } from 'semantic-ui-react';
import { StreamInfo } from '@nuclear/ui';

import styles from './styles.scss';
import { getSelectedStream } from '../../../utils';
import QueuePopupButtons from '../../../containers/QueuePopupButtons';

const POPUP_MARGIN = 15;

export const QueuePopup = ({
  trigger,
  idLabel,
  isOpen,
  handleClose,
  imageReady,
  setImageReady,
  setOpen,
  setTarget,
  target,
  titleLabel,
  track,
  index,
  actions,
  plugins
}) => {
  const triggerElement = useRef(null);
  const popupElement = useRef(null);

  const handleOpen = useCallback(
    event => {
      event.preventDefault();
      triggerElement.current.click();
      const { left, top } = triggerElement.current.getBoundingClientRect();
      setTarget({
        ...target,
        itemX: left,
        itemY: top,
        itemHeight: triggerElement.current.offsetHeight
      });
      setOpen(true);
    },
    [triggerElement, setOpen, setTarget, target]
  );

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

  const handleRerollTrack = track => {
    let musicSource = plugins.plugins.streamProviders.find(
      s =>
        s.sourceName ===
        (track.selectedStream || plugins.selected.streamProviders)
    );

    if (track.failed) {
      musicSource = plugins.plugins.streamProviders.find(
        s => s.sourceName === musicSource.fallback
      );
    }

    const selectedStream = getSelectedStreamForQueueItem(
      track.streams,
      musicSource.sourceName
    );

    actions.rerollTrack(musicSource, selectedStream, track);
  };

  const getSelectedStreamForQueueItem = track => {
    let fallbackStreamProvider;

    if (track.failed) {
      const defaultStreamProvider = plugins.plugins.streamProviders.find(
        ({ sourceName }) => {
          return sourceName === plugins.selected.streamProviders;
        }
      );
      fallbackStreamProvider = plugins.plugins.streamProviders.find(
        ({ sourceName }) => {
          return sourceName === defaultStreamProvider.fallback;
        }
      );
    }
    return getSelectedStream(
      track.streams,
      track.failed
        ? fallbackStreamProvider.sourceName
        : track.selectedStream || plugins.selected.streamProviders
    );
  };

  const handleSelectStream = ({ track, stream }) => {
    actions.changeTrackStream(track, stream);
  };

  const dropdownOptions = _.map(plugins.plugins.streamProviders, s => ({
    key: s.sourceName,
    text: s.sourceName,
    value: s.sourceName,
    content: s.sourceName
  }));

  return (
    <Popup
      className={cs(styles.queue_popup, {
        [styles.hidden]: !imageReady
      })}
      trigger={
        <div ref={triggerElement} onContextMenu={handleOpen}>
          {trigger}
        </div>
      }
      open={isOpen}
      onClose={handleClose}
      hideOnScroll
      position='right center'
      size='small'
      on={null}
      style={
        target && {
          transform: `translate3d(${Math.round(target.x)}px, ${Math.round(
            target.y
          )}px, 0px)`
        }
      }
    >
      <StreamInfo
        dropdownOptions={dropdownOptions}
        idLabel={idLabel}
        titleLabel={titleLabel}
        selectedStream={getSelectedStreamForQueueItem(track)}
        track={track}
        onRerollTrack={handleRerollTrack}
        onSelectStream={handleSelectStream}
        onImageLoaded={handleImageLoaded}
        popupElement={popupElement}
      />
      <hr />
      <div className={styles.queue_popup_buttons_container}>
        <QueuePopupButtons track={track} index={index} />
      </div>
    </Popup>
  );
};

export default compose(
  withState('target', 'setTarget', {
    x: 0,
    y: 0,
    itemX: 0,
    itemY: 0,
    itemHeight: 0
  }),
  withState('isOpen', 'setOpen', false),
  withState('imageReady', 'setImageReady', false),
  withHandlers({
    handleClose: ({ setOpen }) => () => setOpen(false)
  })
)(QueuePopup);

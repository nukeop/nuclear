import React, { useState } from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';
import Img from 'react-image';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

export type ContextPopupProps = {
  trigger: PopupProps['trigger'];
  thumb?: string;
  title: string;
  artist?: string;
  target?: { x: number; y: number };
};

const ContextPopup: React.FC<ContextPopupProps> = ({
  children,
  trigger,
  thumb,
  title,
  artist,
  target
}) => {
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <Popup
      data-testid='context-popup'
      className={styles.context_popup}
      trigger={trigger}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      on='click'
      hideOnScroll
      style={target && {
        transform: `translate3d(${target.x}px, ${target.y}px, 0px)`
      }}
    >
      <div className={styles.popup_header}>
        {thumb &&
        <div className={styles.popup_thumb}>
          <Img 
            src={thumb}
            unloader={<img src={artPlaceholder}/>}
          />
        </div>}
        <div className={styles.popup_info}>
          <div className={styles.popup_title}>
            {title}
          </div>
          {artist &&
          <div className={styles.popup_artist}>
            by {artist}
          </div>}
        </div>
      </div>

      <hr />

      <div
        onClick={handleClose}
        className={styles.popup_buttons}
      >
        {children}
      </div>
    </Popup>
  );
};

export default ContextPopup;

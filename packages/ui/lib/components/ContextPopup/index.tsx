import React, { useState } from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';

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
  const handleSwitch = () => setOpen(!isOpen);

  const ContextWrapper = ({children}) => (
    <React.Fragment>
      {React.Children.map(children, child => (
        React.cloneElement(child, {
          onContextMenu: handleSwitch
        })
      ))}
    </React.Fragment>
  );
  return (
    <Popup
      className={styles.context_popup}
      trigger={<ContextWrapper>{trigger}</ContextWrapper>}
      open={isOpen}
      onClose={handleClose}
      on={null}
      hideOnScroll
      style={target && {
        transform: `translate3d(${target.x}px, ${target.y}px, 0px)`
      }}
      onMouseLeave={handleClose} 
    >
      <div className={styles.popup_header}>
        {thumb &&
        <div className={styles.popup_thumb}>
          <img src={thumb} />
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

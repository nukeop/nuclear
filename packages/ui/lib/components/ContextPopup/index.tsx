import React from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';
import { withState, withHandlers, compose } from 'recompose';

import styles from './styles.scss';

export type ContextPopupProps = {
  trigger: PopupProps['trigger'];
  isOpen: PopupProps['open'];
  handleOpen: PopupProps['onOpen'];
  handleClose: React.MouseEventHandler;

  thumb?: string;
  title: string;
  artist?: string;
  target?: { x: number; y: number };
};

const ContextPopup: React.FC<ContextPopupProps> = ({
  children,
  trigger,
  isOpen,
  handleOpen,
  handleClose,
  thumb,
  title,
  artist,
  target
}) => (
  <Popup
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
      {
        thumb &&
        <div className={styles.popup_thumb}>
          <img src={thumb} />
        </div>
      }
      <div className={styles.popup_info}>
        <div className={styles.popup_title}>
          {title}
        </div>
        {
          artist &&
          <div className={styles.popup_artist}>
            by {artist}
          </div>
        }
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

export default compose(
  withState('isOpen', 'setOpen', false),
  withHandlers({
    handleOpen: ({ setOpen }) => () => setOpen(true),
    handleClose: ({ setOpen }) => () => setOpen(false)
  })
)(ContextPopup);

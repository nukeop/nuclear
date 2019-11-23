import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popup } from 'semantic-ui-react';
import { withState, withHandlers, compose } from 'recompose';

import styles from './styles.scss';

const ContextPopup = ({
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
    style={{
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
          !_.isNil(artist) &&
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

ContextPopup.propTypes = {
  children: PropTypes.node,
  trigger: PropTypes.node,
  thumb: PropTypes.string,
  title: PropTypes.string,
  artist: PropTypes.string,
  target: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
};

export default compose(
  withState('isOpen', 'setOpen', false),
  withHandlers({
    handleOpen: ({setOpen}) => () => setOpen(true),
    handleClose: ({setOpen}) => () => setOpen(false)
  })
)(ContextPopup);

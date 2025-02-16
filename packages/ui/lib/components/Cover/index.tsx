import React from 'react';
import Img from 'react-image';
import cx from 'classnames';

import artPlaceholder from '../../../resources/media/art_placeholder.png';

import common from '../../common.scss';
import styles from './styles.scss';

type CoverProps = {
  cover?: string;
}

const Cover: React.FC<CoverProps> = ({ cover = String(artPlaceholder) }) => (
  <div className={cx(
    common.nuclear,
    styles.cover_container
  )}>
    <Img 
      src={cover || String(artPlaceholder)}
      unloader={<img src={String(artPlaceholder)}/>} 
    />
  </div>
);

export default Cover;

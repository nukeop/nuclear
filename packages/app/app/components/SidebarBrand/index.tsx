import React from 'react';
import styles from './styles.scss';

import logoIcon from '../../../resources/media/512x512.png';
import { Tooltip } from '@nuclear/ui';

const SidebarBrand = () => <div className={styles.sidebar_brand}>
  <Tooltip 
    content={process.env.NUCLEAR_VERSION}trigger={
      <img src={logoIcon} />
    } />
</div>;

export default SidebarBrand;

import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../Header';
import LibraryFolders from '../LibraryFolders';

import styles from './styles.scss';

const LibraryHeader = props => (
  <>
    <Header>{t('header')}</Header>
  
  </>
);

LibraryHeader.propTypes = {

};

export default LibraryHeader;

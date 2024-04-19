import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { withHandlers, withState, compose } from 'recompose';

import Header from '../../Header';
import LibraryFolders from '../LibraryFolders';

import styles from './styles.scss';

const LibraryHeader = ({
  t,
  collapsed,
  toggleCollapsed,
  ...rest
}) => (
  <>
    <div className={cx(
      styles.library_header_row,
      { collapsed }
    )}>
      <Header>{ t('header') }</Header>
      <Button
        basic
        icon={`chevron ${collapsed ? 'down' : 'up'}`}
        onClick={toggleCollapsed}
      />
    </div>
    { !collapsed && <LibraryFolders {...rest}/> }
  </>
);

LibraryHeader.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func
};

LibraryHeader.defaultProps = {
  collapsed: false,
  setCollapsed: () => {}
};

export default compose(
  withTranslation('library'),
  withState('collapsed', 'setCollapsed', false),
  withHandlers({
    toggleCollapsed: ({ collapsed, setCollapsed }) => () => setCollapsed(!collapsed)
  })
)(LibraryHeader);

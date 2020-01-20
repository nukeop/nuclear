import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Input, Dropdown } from 'semantic-ui-react';
import { withHandlers } from 'recompose';

import common from '../../common.scss';
import styles from './styles.scss';

const SearchBox = ({
  loading,
  placeholder,
  searchProviders,
  selectedSearchProvider,
  onSearchProviderSelect
}) => (
  <div
    className={cx(
      common.nuclear,
      styles.search_box
    )}
  >
    <Input
      inverted
      loading={loading}
      label={
        <Dropdown 
          value={selectedSearchProvider.value}
          onChange={onSearchProviderSelect}
          options={searchProviders}
        />
      }
      labelPosition='right'
      placeholder={placeholder}
    />
  </div>
);

const optionShape = PropTypes.shape({
  key: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.string
});

SearchBox.propTypes = {
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  searchProviders: PropTypes.arrayOf(optionShape),
  selectedSearchProvider: PropTypes.string,
  onSearchProviderSelect: PropTypes.func
};

export default withHandlers(
  {
    onSearchProviderSelect: 
    ({searchProviders, onSearchProviderSelect}) => 
      (e, {value}) => 
        onSearchProviderSelect(_.find(searchProviders, { value }))
  }
)(SearchBox);

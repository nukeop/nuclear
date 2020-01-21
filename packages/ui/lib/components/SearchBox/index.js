import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Icon, Input, Dropdown } from 'semantic-ui-react';
import { withHandlers } from 'recompose';

import common from '../../common.scss';
import styles from './styles.scss';

const SearchBox = ({
  loading,
  disabled,
  placeholder,
  searchProviders,
  selectedSearchProvider,
  onSearchProviderSelect,
  onChange
}) => (
  <div
    className={cx(
      common.nuclear,
      styles.search_box_container
    )}
  >
    <Input
      inverted
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
    >
      <Icon name='search' />
      <input autoFocus/>
      { loading && <Icon name='spinner' loading /> }
      {
        !_.isNil(searchProviders) && !_.isEmpty(searchProviders) &&
        <Dropdown 
          value={selectedSearchProvider.value}
          onChange={onSearchProviderSelect}
          options={searchProviders}
          disabled={disabled}
        />
      }
    </Input>
  </div>
);

const optionShape = PropTypes.shape({
  key: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.string
});

SearchBox.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  searchProviders: PropTypes.arrayOf(optionShape),
  selectedSearchProvider: PropTypes.string,
  onSearchProviderSelect: PropTypes.func,
  onChange: PropTypes.func
};

export default withHandlers(
  {
    onSearchProviderSelect: 
    ({searchProviders, onSearchProviderSelect}) => 
      (e, {value}) => 
        onSearchProviderSelect(_.find(searchProviders, { value }))
  }
)(SearchBox);

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Icon, Dropdown } from 'semantic-ui-react';
import { compose, withHandlers, withState } from 'recompose';

import common from '../../common.scss';
import styles from './styles.scss';

const SearchBox = ({
  loading,
  disabled,
  placeholder,
  searchProviders,
  selectedSearchProvider,
  onSearchProviderSelect,
  onChange,
  onKeyDown
}) => (
    <div
      className={cx(
        common.nuclear,
        styles.search_box_container
      )}
    >
      <Icon name='search' disabled={disabled} />
      <input
        autoFocus
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={cx({ [styles.disabled]: disabled })}
      />
      {loading && <Icon name='spinner' loading />}
      {
        !_.isNil(searchProviders) && !_.isEmpty(searchProviders) &&
        <Dropdown
          value={selectedSearchProvider.value}
          onChange={onSearchProviderSelect}
          options={searchProviders}
          disabled={disabled}
        />
      }
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
  selectedSearchProvider: optionShape,
  onSearchProviderSelect: PropTypes.func,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,

  setTerms: PropTypes.func,
  terms: PropTypes.string
};

const RETURN_KEYCODE = 13;
export default compose(
  withState('terms', 'setTerms', ''),
  withHandlers({
  onSearchProviderSelect:
    ({ searchProviders, onSearchProviderSelect }) =>
      (e, { value }) =>
        onSearchProviderSelect(_.find(searchProviders, { value })),
  onChange: ({ onChange, setTerms }) => e => {
    setTerms(e.target.value);
    onChange(e.target.value);
  },
  onKeyDown: ({ onSearch, terms }) => e => e.which === RETURN_KEYCODE && onSearch(terms)
})
)(SearchBox);

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Dropdown, Icon } from 'semantic-ui-react';
import { compose, withHandlers, withState } from 'recompose';
import SearchBoxDropdown from '../SearchBoxDropbown';

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
  onKeyDown,
  handleFocus,
  isFocused,
  onClick
}) => {

  const searchRef = useRef(null);
  useEffect(() => {
    const handleClick = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        handleFocus(false);
      }
    };
    if (isFocused) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [handleFocus, isFocused, searchRef]);

  return (
    <div className={cx(common.nuclear, styles.search_box_container)}>

      <div
        className={cx(
          common.nuclear,
          styles.search_box
        )}
        ref={searchRef}
      >
        <Icon name='search' disabled={disabled}/>
        <input
          autoFocus
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className={cx({ [styles.disabled]: disabled })}
          onClick={onClick}
        />
        {loading && <Icon name='spinner' loading/>}
        {
          !_.isNil(searchProviders) && !_.isEmpty(searchProviders) &&
          <Dropdown
            value={selectedSearchProvider.value}
            onChange={onSearchProviderSelect}
            options={searchProviders}
            disabled={disabled}
          />
        }
        {isFocused ? <SearchBoxDropdown display={isFocused}/> : null}
      </div>
    </div>
  );
};

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

  /* eslint-disable react/no-unused-prop-types */
  onSearch: PropTypes.func,
  setTerms: PropTypes.func,
  terms: PropTypes.string,
  /* eslint-enable react/no-unused-prop-types */
  handleFocus: PropTypes.func
};

const RETURN_KEYCODE = 13;
const ESC_KEYCODE = 27;
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
    onKeyDown: ({ onSearch, terms, handleFocus }) => e => {
      if (e.which === RETURN_KEYCODE) {
        onSearch(terms);
      }
      if (e.which === ESC_KEYCODE) {
        handleFocus(false);
      }
    },
    onClick: ({ handleFocus }) => () => handleFocus(true)
  })
)(SearchBox);

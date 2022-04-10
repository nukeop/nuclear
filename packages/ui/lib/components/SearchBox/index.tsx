import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Dropdown, Icon } from 'semantic-ui-react';
import SearchBoxDropdown from '../SearchBoxDropbown';
import common from '../../common.scss';
import styles from './styles.scss';
import { SearchProviderOption } from '../../types';


type SearchBarProps = {
  loading: boolean
  disabled: boolean
  placeholder: string 
  searchProviders: SearchProviderOption[]
  searchHistory: string[]
  lastSearchesLabel: string
  clearHistoryLabel: string
  footerLabel: string
  onClearHistory: React.MouseEventHandler;
  onSearch: (entry: string) => void
  selectedSearchProvider: SearchProviderOption
  onSearchProviderSelect: (provider: SearchProviderOption) => void
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  handleFocus: (bool: boolean) => void
  isFocused: boolean
  input: string
  setInput: (v: string) => void
}

const SearchBox: React.FC<SearchBarProps> = ({
  loading,
  disabled,
  placeholder,
  searchProviders,
  searchHistory,
  lastSearchesLabel,
  clearHistoryLabel,
  footerLabel,
  onClearHistory,
  onSearch,
  selectedSearchProvider,
  onSearchProviderSelect,
  onKeyDown,
  handleFocus,
  isFocused,
  input,
  setInput
}) => {
  const searchRef = useRef(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
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
        <Icon name='search' disabled={disabled} />
        <input
          data-testid='search-input'
          autoFocus
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className={cx({ [styles.disabled]: disabled })}
          onClick={() => handleFocus(true)}
          value={input}
        />
        {loading && <Icon name='spinner' loading />}
        {
          !_.isNil(searchProviders) && !_.isEmpty(searchProviders) &&
          <Dropdown
            value={selectedSearchProvider.value}
            onChange={(__, data) =>  onSearchProviderSelect(_.find(searchProviders, (opt) => opt.value === data.value))}
            options={searchProviders}
            disabled={disabled}
          />
        }
        {
          isFocused && <SearchBoxDropdown
            display={isFocused}
            searchHistory={searchHistory}
            lastSearchesLabel={lastSearchesLabel}
            clearHistoryLabel={clearHistoryLabel}
            footerLabel={footerLabel}
            onClearHistory={onClearHistory}
            onClickHistoryEntry={onSearch}
          />
        }
      </div>
    </div>
  );
};

export default SearchBox;

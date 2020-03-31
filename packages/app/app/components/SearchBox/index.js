import React, {useCallback, useEffect, useRef, useState} from 'react';
import DebounceInput from 'react-debounce-input';
import {Icon} from 'semantic-ui-react';

import styles from './styles.scss';
import {useTranslation} from 'react-i18next';
import SearchDropdown from '../SearchDropdown';

const RETURN_KEYCODE = 13;
const ESC_KEYCODE = 27;

const SearchBox = ({handleSearch, loading, isConnected, isFocused, handleFocus}) => {
  const { t } = useTranslation('search');
  const [latestSearch, setSearch] = useState('');
  const searchRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.which === RETURN_KEYCODE) {
      handleSearch(latestSearch);
    }
    if (e.which === ESC_KEYCODE) {
      handleFocus(false);
    }
  }, [handleFocus, handleSearch, latestSearch]);

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

  const handleSearchInner = useCallback((value) => {
    setSearch(value);
    handleSearch(value);
  }, [handleSearch]);
  
  const handleClick = useCallback(() => {
    handleFocus(true);
  }, [handleFocus]);
  
  return (
    <div className={styles.search_box_container} ref={searchRef}>
      {isConnected && (
        <div className={'search_box'}>
          <Icon name='search'/>
          <div className='form'>
            <DebounceInput
              placeholder={t('placeholder')}
              minLength={2}
              debounceTimeout={500}
              onChange={handleSearchInner}
              onKeyDown={handleKeyDown}
              autoFocus
              onClick={handleClick}
            />
            <Icon name='spinner' loading={loading}/>
          </div>
          <SearchDropdown display={isFocused}/>
        </div>
      )}
    </div>
  );
};

export default SearchBox;

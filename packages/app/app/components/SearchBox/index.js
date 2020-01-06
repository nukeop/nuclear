import React, {useCallback, useState, Fragment} from 'react';
import DebounceInput from 'react-debounce-input';
import { Icon } from 'semantic-ui-react'; 

import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const RETURN_KEYCODE = 13;

const SearchBox = ({ handleSearch, loading, isConnected }) => {
  const { t } = useTranslation('search');
  const [latestSearch, setSearch] = useState('');
  const handleKeyDown = useCallback((e) => {
    if (e.which === RETURN_KEYCODE) {
      handleSearch(latestSearch);
    }
  }, [handleSearch, latestSearch]);

  const handleSearchInner = useCallback((value) => {
    setSearch(value);
    handleSearch(value);
  }, [handleSearch]);

  return (
    <div className={styles.search_box_container}>
      {isConnected && (
        <Fragment>
          <Icon name='search' />
          <div className='form'>
            <DebounceInput
              placeholder={t('placeholder')}
              minLength={2}
              debounceTimeout={500}
              onChange={handleSearchInner}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Icon name='spinner' loading={loading} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default SearchBox;

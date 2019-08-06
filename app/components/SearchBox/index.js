import React from 'react';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import DebounceInput from 'react-debounce-input';

import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const SearchBox = ({ handleSearch, loading }) => {
  const { t } = useTranslation('search');

  return (
    <div className={styles.search_box_container}>
      <FontAwesome name='search' />
      <div className='form'>
        <DebounceInput
          placeholder={t('placeholder')}
          minLength={2}
          debounceTimeout={500}
          onChange={handleSearch}
          autoFocus
        />
        <FontAwesome name='spinner' pulse className={classnames({loading})} />
      </div>
    </div>
  );
};

export default SearchBox;

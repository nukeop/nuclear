import React from 'react';
import _ from 'lodash';

import styles from './styles.scss';
import { Icon, SemanticICONS } from 'semantic-ui-react';

export type SearchBoxDropdownProps = {
  display?: boolean;
  searchHistory: string[];
  lastSearchesLabel: string;
  clearHistoryLabel: string;
  footerLabel: string;
  onClickHistoryEntry: (entry: string) => void;
  onClearHistory: React.MouseEventHandler;
}

type SearchExampleProps = {
  iconName: SemanticICONS;
  label: string;
}

const SearchExample: React.FC<SearchExampleProps> = ({
  iconName,
  label
}) => <div className={styles.search_example}>
  <Icon fitted size='big' name={iconName} />
  {label}
</div>;

const SearchBoxDropdown: React.FC<SearchBoxDropdownProps> = ({
  display = false,
  searchHistory,
  lastSearchesLabel,
  clearHistoryLabel,
  footerLabel,
  onClickHistoryEntry,
  onClearHistory
}) => display && (
  <div className={styles.search_box_dropdown}>
    {
      !_.isEmpty(searchHistory) &&
      <>
        <div className={styles.search_history_header}>
          <label>{lastSearchesLabel}</label>
          <a href='#' onClick={onClearHistory}>
            {clearHistoryLabel}
            <Icon fitted name='times' />
          </a>
        </div>
        {
          _(searchHistory)
            .uniq()
            .take(5)
            .map(entry => <div
              className={styles.search_history_entry}
              key={entry}
              onClick={() => onClickHistoryEntry(entry)}
            >
              {entry}
            </div>)
            .value()
        }
        <hr />
      </>
    }
    <div className={styles.search_history_footer}>
      <label>{footerLabel}</label>
      <div className={styles.search_examples}>
        <SearchExample iconName='dot circle' label='Albums' />
        <SearchExample iconName='microphone' label='Artists' />
        <SearchExample iconName='music' label='Tracks' />
      </div>
    </div>
  </div>);

export default SearchBoxDropdown;

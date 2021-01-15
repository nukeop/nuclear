import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, withProps } from 'recompose';
import { withTranslation } from 'react-i18next';
import { SearchBox } from '@nuclear/ui';

import * as SearchActions from '../../actions/search';
import * as PluginActions from '../../actions/plugins';
import { pluginsSelectors } from '../../selectors/plugins';

const MIN_SEARCH_LENGTH = 3;
const SearchBoxContainer = ({
  handleSearch,
  unifiedSearchStarted,
  searchProvidersOptions,
  searchHistory,
  handleClearSearchHistory,
  selectedSearchProviderOption,
  handleSelectSearchProvider,
  isConnected,
  t,
  isFocused,
  handleFocus
}) => (
  <SearchBox
    loading={unifiedSearchStarted}
    disabled={!isConnected}
    placeholder={t('placeholder')}
    lastSearchesLabel={t('last-searches')}
    clearHistoryLabel={t('clear-history')}
    footerLabel={t('you-can-search-for')}
    onChange={_.debounce(handleSearch, 500)}
    onSearch={handleSearch}
    searchProviders={searchProvidersOptions}
    searchHistory={searchHistory}
    onClearHistory={handleClearSearchHistory}
    selectedSearchProvider={selectedSearchProviderOption}
    onSearchProviderSelect={handleSelectSearchProvider}
    isFocused={isFocused}
    handleFocus={handleFocus}
  />
);

const mapStateToProps = state => ({
  unifiedSearchStarted: state.search.unifiedSearchStarted,
  searchHistory: state.search.searchHistory,
  isConnected: state.connectivity,
  searchProviders: _.get(pluginsSelectors.plugins(state), 'metaProviders'),
  selectedSearchProvider: _.get(pluginsSelectors.selected(state), 'metaProviders'),
  isFocused: state.search.isFocused
});

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators({
    ...SearchActions,
    ...SearchActions.SearchActions
  }, dispatch),
  pluginActions: bindActionCreators(PluginActions, dispatch)
});

const providerToOption = provider => ({
  key: _.lowerCase(_.get(provider, 'sourceName')),
  text: _.get(provider, 'searchName'),
  value: _.get(provider, 'sourceName')
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation('search'),
  withHandlers({
    handleSearch:
      ({ searchActions, history }) => value =>
        value.length >= MIN_SEARCH_LENGTH ? searchActions.unifiedSearch(value, history) : null,
    handleSelectSearchProvider:
      ({ pluginActions }) => provider =>
        pluginActions.selectMetaProvider(provider.value),
    handleFocus: ({ searchActions }) => bool => searchActions.setSearchDropdownVisibility(bool),
    handleClearSearchHistory: ({ searchActions }) => () => searchActions.updateSearchHistory([])
  }),
  withProps(({ searchProviders, selectedSearchProvider }) => ({
    searchProvidersOptions: _.map(searchProviders, providerToOption),
    selectedSearchProviderOption: providerToOption(
      _.find(searchProviders, { sourceName: selectedSearchProvider })
    )
  }))
)(SearchBoxContainer);

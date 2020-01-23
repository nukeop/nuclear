import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, withProps } from 'recompose';
import { SearchBox } from '@nuclear/ui';

import * as SearchActions from '../../actions/search';
import * as PluginActions from '../../actions/plugins';

const MIN_SEARCH_LENGTH = 3;
const SearchBoxContainer = ({
  handleSearch,
  unifiedSearchStarted,
  searchProvidersOptions,
  selectedSearchProviderOption,
  handleSelectSearchProvider,
  isConnected
}) => (
  <SearchBox
    loading={unifiedSearchStarted}
    disabled={!isConnected}
    onChange={_.debounce(handleSearch, 500)}
    searchProviders={searchProvidersOptions}
    selectedSearchProvider={selectedSearchProviderOption}
    onSearchProviderSelect={handleSelectSearchProvider}
  />
);

const mapStateToProps = state => ({
  unifiedSearchStarted: state.search.unifiedSearchStarted,
  isConnected: state.connectivity,
  searchProviders: state.plugin.plugins.metaProviders,
  selectedSearchProvider: state.plugin.selected.metaProviders
});

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators(SearchActions, dispatch),
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
  withHandlers({
    handleSearch: 
    ({ searchActions, history }) => value => 
      value.length >= MIN_SEARCH_LENGTH ? searchActions.unifiedSearch(value, history) : null,
    handleSelectSearchProvider:  
      ({ pluginActions }) => provider => 
        pluginActions.selectMetaProvider(provider.value)
  }),
  withProps(({searchProviders, selectedSearchProvider}) => ({
    searchProvidersOptions: _.map(searchProviders, providerToOption),
    selectedSearchProviderOption: providerToOption(
      _.find(searchProviders, { sourceName: selectedSearchProvider })
    )
  }))
)(SearchBoxContainer);

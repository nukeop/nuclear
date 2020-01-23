import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { SearchBox } from '@nuclear/ui';

import * as SearchActions from '../../actions/search';
import * as PluginActions from '../../actions/plugins';

const MIN_SEARCH_LENGTH = 3;
const SearchBoxContainer = ({
  handleSearch,
  unifiedSearchStarted,
  searchProviders,
  selectedSearchProvider,
  setSelectedSearchProvider,
  isConnected
}) => (
  <SearchBox
    loading={unifiedSearchStarted}
    disabled={!isConnected}
    onChange={_.debounce(handleSearch, 500)}
    searchProviders={searchProviders}
    selectedSearchProvider={
      _.isNil(selectedSearchProvider)
        ? _.head(searchProviders)
        : selectedSearchProvider
    }
    onSearchProviderSelect={setSelectedSearchProvider}
  />
);

const mapStateToProps = state => ({
  unifiedSearchStarted: state.search.unifiedSearchStarted,
  isConnected: state.connectivity,
  searchProviders: state.plugin.plugins.metaProviders,
  selectedSearchProvider: state.plugin.selected
});

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators(SearchActions, dispatch),
  pluginActions: bindActionCreators(PluginActions, dispatch)
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
        pluginActions.selectMetaProvider(provider.sourceName)
  }),
  withProps(({searchProviders}) => ({
    searchProviders: _.map(searchProviders, provider => ({
      key: _.lowerCase(provider.sourceName),
      text: provider.searchName,
      value: _.lowerCase(provider.sourceName),
      sourceName: provider.sourceName
    }))
  })),
  withState(
    'selectedSearchProvider', 
    'setSelectedSearchProvider',
    undefined
  )
)(SearchBoxContainer);

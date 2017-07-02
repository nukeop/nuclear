import React from 'react';
import { Route, Switch } from 'react-router';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import MainLayout from '../../components/MainLayout';

class MainContentContainer extends React.Component {

  render() {
    return(

      <Route path='/' render={({location, history, match}) => {
        return (
          <RouteTransition
            pathname={location.pathname}
            atEnter={{opacity: 0}}
            atLeave={{opacity: 0}}
            atActive={{opacity: 1}}
            >
              <Switch key={location.key} location={location}>
                <Route path="/" component={MainLayout} />
              </Switch>
            </RouteTransition>
          );
        }
      }>

    </Route>
  );
}
}

function mapStateToProps(state) {
  return {
    unifiedSearchResults: state.search.unifiedSearchResults
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContentContainer);

import React from 'react';
import {Dimmer, Loader, Tab} from 'semantic-ui-react';

class NewsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      news
    } = this.props;
    console.log(news);
    return (
      <Tab.Pane attached={false}>
	test
      </Tab.Pane>
    );
  }
}

export default NewsTab;

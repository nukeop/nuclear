import React from 'react';

import Tools from '../components/tools.component';

class ToolsContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return <Tools
    albumart={this.props.albumart}
    title={this.props.title}
      />;
  }
}

export default ToolsContainer;

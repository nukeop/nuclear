import React from 'react';

class Spacer extends React.Component {
  render() {
    return (
      <div style={Object.assign({}, {flex: '1 1 auto'}, this.props.style)} />
    );
  }
}

export default Spacer;

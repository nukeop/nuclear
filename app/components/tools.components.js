import React from 'react';

import SearchField from './searchfield.component.js';

class Tools extends React.Component {
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){
    return(
        <div className="col-md-2 tools-panel">
          <div className="panel panel-default">
          </div>
        </div>
    );
  };
}

export default Tools;

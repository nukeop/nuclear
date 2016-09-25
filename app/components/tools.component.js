import React from 'react';

import AlbumArt from './albumart.component';

class Tools extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
        <div className="col-md-2 tools-panel">
        <div className="panel panel-default">
        <AlbumArt
      albumart={this.props.albumart}
      title={this.props.title}
        />
        </div>
        </div>
    );
  };
}

export default Tools;

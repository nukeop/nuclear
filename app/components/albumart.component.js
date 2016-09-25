import React from 'react';

class AlbumArt extends React.Component {
  constructor(props){
    super(props);
  }

  render() {

    const footerStyle={
      padding: 0,
      position:'absolute',
      width:'100%',
      bottom:140,
      textAlign: 'center'
    };

    return(
        <div style={footerStyle}>
        <img src={this.props.albumart} width='100%' height='100%'></img>
        <br /><br />
        {this.props.title}
        </div>
    );
  };
}

export default AlbumArt;

import React from 'react';

class Navbar extends React.Component{

  close(){
    window.close();
  }

  maximise(){
    window.require('electron').remote.BrowserWindow.getFocusedWindow().maximize();
  }

  minimise(){
    window.require('electron').remote.BrowserWindow.getFocusedWindow().minimize();
  }

  render() {

    const windowButtonOffset = {
      paddingLeft: '8px',
      paddingRight: '8px'
    };

    const iconStyle={
      paddingTop: '4px'
    };

    const brandStyle={
      paddingTop: '2px'
    }

    return (
        <nav className="navbar navbar-inverse navbar-fixed-top">

        <a className="navbar-brand">
        <img src="media/nuclear/icon_16x16.png" style={iconStyle}></img>
        </a>
        <a className="navbar-brand" style={brandStyle}>
        nuclear
        </a>

        <ul className="nav navbar-nav navbar-right">
        <button type="button" className="btn btn-link navbar-btn navbar-window-buttons" onClick={this.minimise} style={windowButtonOffset}><i className="fa fa-minus" aria-hidden="true"></i></button>
        <button type="button" className="btn btn-link navbar-btn navbar-window-buttons" onClick={this.maximise} style={windowButtonOffset}><i className="fa fa-expand" aria-hidden="true"></i></button>
        <button type="button" className="btn btn-link navbar-btn navbar-window-buttons" onClick={this.close}><i className="fa fa-times" aria-hidden="true"></i></button>
        </ul>

        </nav>
    );
  }

}

export default Navbar;

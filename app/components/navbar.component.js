import React from 'react';

class Navbar extends React.Component{

  close(){
    window.close();
  }

  maximise(){
    console.log("maximise not implemented yet");
  }

  minimise(){
    console.log("minimise not implemented yet");
  }

  render() {

    const windowButtonOffset = {
      paddingLeft: '6px',
      paddingRight: '6px'
    };

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <a className="navbar-brand">Nuclear</a>

        <ul className="nav navbar-nav navbar-right">
        <button type="button" className="btn btn-link navbar-btn navbar-window-buttons" onClick={this.close}><i className="fa fa-times" aria-hidden="true"></i></button>
        </ul>

      </nav>
    );
  }

}

export default Navbar;

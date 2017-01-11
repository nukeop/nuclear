import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Navbar.css';

export default class Navbar extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
        <div>
          <nav className="navbar navbar-inverse">

            <button className="pull-left btn btn-link" onClick={this.props.onClick}><i className="fa fa-bars" aria-hidden="true"></i></button>
            <div className="navbar-header">

              <a className="navbar-brand"><i className="fa fa-music" aria-hidden="true"></i> nuclear</a>
            </div>

          </nav>
        </div>
    );
  }

}

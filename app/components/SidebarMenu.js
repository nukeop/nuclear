import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import styles from './SidebarMenu.css';

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false
    };
  }

  componentWillMount() {
    this.showSidebar = this.showSidebar.bind(this);
    this.hideSidebar = this.hideSidebar.bind(this);
  }

  showSidebar(){
    this.setState({sidebarOpen: true});
  }

  hideSidebar(){
    this.setState({sidebarOpen: false});
  }

  toggleSidebar(){
    if (this.state.sidebarOpen){
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  render() {
    return (
      <div>
        <Sidebar
          sidebar=""
          open={this.state.sidebarOpen}
          children=""
          sidebarClassName={styles.sidebar}
        />
      </div>
    );
  }
}

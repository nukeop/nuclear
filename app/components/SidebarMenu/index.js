import React from 'react';

import styles from './styles.css';

import SidebarMenuItem from './SidebarMenuItem';

class SidebarMenu extends React.Component {
  constructor(props){
    super(props);
  }

  renderItems(){
    return this.props.children.map((el, i) => {
      return (
        <SidebarMenuItem key={i}>
          {el}
        </SidebarMenuItem>
      );
    });
  }

  render() {
    return (
      <div className={styles.sidebar_menu_container}>
        { this.renderItems() }
      </div>
    );
  }
}

export default SidebarMenu;

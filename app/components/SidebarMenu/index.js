import React from 'react';

import styles from './styles.scss';

import SidebarMenuItem from './SidebarMenuItem';

class SidebarMenu extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let {
      children
    } = this.props;
    
    return (
      <div className={styles.sidebar_menu_container}>
        { children }
      </div>
    );
  }
}

export default SidebarMenu;

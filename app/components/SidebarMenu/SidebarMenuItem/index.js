import React from 'react';

import styles from './styles.css';

class SidebarMenuItem extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={styles.sidebar_menu_item_container}>
        {this.props.children}
      </div>
    );
  }
}

export default SidebarMenuItem;

import React from 'react';
import PropTypes from 'prop-types';

import sidebarItemStyles from '../SidebarMenu/SidebarMenuItem/styles.scss';
import styles from './styles.scss';

class ExpandingMenuNavLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  toggleExpanded() {
    this.setState(prevState => {
      return { expanded: !prevState.expanded };
    });
  }
  
  render() {
    if (this.props.compactMenuBar) {
      return null;
    }
    
    return (
      <div
        className={styles.expanding_menu_navlink}
      >
        <div
          className={styles.expanding_menu_navlink_header}
          onClick={ this.toggleExpanded.bind(this) }
        >
          { this.props.title }
        </div>
        {
          this.state.expanded &&
            React.Children.map(this.props.children, child => {
              return (
                <React.Fragment>
                  { child }
                </React.Fragment>
              );
            })
        }
      </div>
    );
  }
}

ExpandingMenuNavLink.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  compactMenuBar: PropTypes.bool
};

export default ExpandingMenuNavLink;

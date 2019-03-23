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
    return (
      <div
        className={styles.expanding_menu_navlink}
      >
        <div
          className={styles.expanding_menu_navlink_header}
          onClick={ this.toggleExpanded.bind(this) }
        >
          Collection
        </div>
        {
          this.state.expanded &&
            Array.isArray(this.props.children) &&
            this.props.children.map(child => {
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
  children: PropTypes.node
};

export default ExpandingMenuNavLink;

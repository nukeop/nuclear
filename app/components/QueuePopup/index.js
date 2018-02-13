import React from 'react';
import { Popup } from 'semantic-ui-react';

import styles from './styles.scss';

class QueuePopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
    this.container.click();
  }

  handleOpen() {
    this.setState({ isOpen: true });
  }

  handleClose() {
    this.setState({ isOpen: false });
  }
  
  render() {
    let {
      trigger
    } = this.props;
    return (
      <div
	onContextMenu={this.toggleOpen.bind(this)}
	>
	<Popup
	  className={styles.queue_popup}
	  trigger={
	        <div
		  ref={element => { this.container = element; }}
		  >
		  {trigger}
		</div>
	      }
	  open={this.state.isOpen}
	  onClose={this.handleClose.bind(this)}
	  onOpen={this.handleOpen.bind(this)}
	  hideOnScroll
	  position='left center'
	  on=''
	>
          <div>
	    test
	  </div>
	</Popup>
      </div>
    );
  }
}

export default QueuePopup;

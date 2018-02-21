import React from 'react';
import { Button, Input, Modal } from 'semantic-ui-react';

import styles from './styles.scss';

class InputDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      inputString: ''
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClose() {
    this.setState({
      isOpen: false
    });
  }

  handleOpen() {
    this.setState({
      isOpen: true
    });
  }

  handleChange(e) {
    this.setState({
      inputString: e.target.value
    });
  }

  render() {
    let {
      trigger,
      header,
      placeholder,
      accept,
      onAccept
    } = this.props;

    let onClick = () => {
      onAccept(this.state.inputString);
      this.handleClose();
    };

    return (
      <Modal
        basic
        closeIcon
        dimmer='blurring'
        trigger={trigger}
        onClose={this.handleClose}
        onOpen={this.handleOpen.bind(this)}
        open={this.state.isOpen}
      >
        <Modal.Content>
          {header}
          <Input
            fluid
            inverted
            ref={input => { input && input.focus(); }}
            placeholder={placeholder}
	    onChange={this.handleChange}
	     />
	</Modal.Content>
	<Modal.Actions>
	  <Button onClick={this.handleClose} basic color='red' inverted>
            Cancel
	  </Button>
	  <Button color='green' inverted onClick={onClick}>
            {accept}
	  </Button>
	</Modal.Actions>
      </Modal>
    );
  }
}

export default InputDialog;

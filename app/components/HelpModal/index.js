import React from 'react';
import {
  Button,
  Header,
  Image,
  Modal
} from 'semantic-ui-react';

import HelpButton from '../HelpButton';
import { agplDisclaimer } from './const';

import logoImg from '../../../resources/media/logo_full_light.png';
import styles from './styles.scss';

class HelpModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }
  
  render() {
    return (
      <Modal
        open={ this.state.open }
        onClose={ this.handleClose.bind(this) }
        basic
        centered
        dimmer='blurring'
        trigger={ <HelpButton onClick={ this.handleOpen.bind(this) } /> }
        className={ styles.help_modal }
      >
        <Modal.Header>About Nuclear Music Player</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src={logoImg}/>
          <Modal.Description>
            <Header inverted>Desktop music player for streaming from free sources</Header>
            <p>Copyright © <a href='https://github.com/nukeop/'>nukeop</a> 2019, released under AGPL-3.0</p>
            <p>Many thanks to our contributors on Github, your help was vital in creating this program.</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Content>
          <Modal.Description>
            { agplDisclaimer }
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default HelpModal;

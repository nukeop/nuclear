import React from 'react';
import { Popup } from 'semantic-ui-react';

import styles from './styles.scss';

class ContextPopup extends React.Component {
  constructor(props) {
    super(props);

    this.clickOutsideListener = document.body.addEventListener('click', e => {
      if(this.state.isOpen){
        setTimeout(() => {
          this.handleClose();
        }, 10);
      }
    });
    
    this.state = {
      isOpen: false      
    };
  }

  componentDidMount() {
  }
  
  handleOpen() {
    this.setState({ isOpen: true });
  }

  handleClose() {    
    this.setState({ isOpen: false });
  }
  
  render() {
    return (
      <Popup
        className={styles.popup_content}
        trigger={this.props.trigger}
        on='click'
        open={this.state.isOpen}
        onClose={this.handleClose.bind(this)}
        onOpen={this.handleOpen.bind(this)}
        hideOnScroll
	    >
        <div className={styles.popup_header}>
          <div className={styles.popup_thumb}><img src={this.props.thumb} /></div>
          <div className={styles.popup_info}>
            <div className={styles.popup_title}>{this.props.title}</div>
            {
	            this.props.artist
	              ? <div className={styles.popup_artist}>by {this.props.artist}</div>
	              : null
	          }
          </div>
        </div>

        <hr />

        <div onClick={this.handleClose.bind(this)} className={styles.popup_buttons}>
          {this.props.children}
        </div>

      </Popup>
    );
  }
}

export default ContextPopup;

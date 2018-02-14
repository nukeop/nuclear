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
      trigger,
      track
    } = this.props;
    console.log(track);
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
      {
	track.streams && Object.keys(track.streams).length > 0
	  ? (
	    <div className={styles.stream_info}>
              <div className={styles.stream_source}>
		Source: <span className={styles.stream_source_string}>{track.streams[0].source}</span>
	      </div>
              <div className={styles.stream_title}>
		Title: {track.streams[0].title}
	      </div>
              <div className={styles.stream_id}>
		Stream ID: {track.streams[0].id}
	      </div>
              <img alt="" src={track.streams[0].thumbnail} />
	      
	    </div>
	  )
	: null
      }
      
      </Popup>
</div>
    );
  }
}

export default QueuePopup;

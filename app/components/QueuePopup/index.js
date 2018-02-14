import React from 'react';
import _ from 'lodash';
import {
  Dropdown,
  Popup
} from 'semantic-ui-react';

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
      track,
      musicSources
    } = this.props;
    
    let dropdownOptions = _.map(musicSources, s => {
      return {
	key: s.sourceName,
	text: s.sourceName,
	value: s.sourceName,
	content: s.sourceName
      };
    });
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
		  <div className={styles.stream_thumbnail}>
		    <img alt="" src={track.streams[0].thumbnail} />
		  </div>
		  <div className={styles.stream_text_info}>
		    <div className={styles.stream_source}>
		      Source: <Dropdown
				inline
				options={dropdownOptions}
				defaultValue={_.find(dropdownOptions, o => o.value === track.streams[0].source).value}
			/>
		    </div>
		    <div className={styles.stream_title}>
		      Title: {track.streams[0].title}
		    </div>
		    <div className={styles.stream_id}>
		      Stream ID: {track.streams[0].id}
		    </div>
		  </div>

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

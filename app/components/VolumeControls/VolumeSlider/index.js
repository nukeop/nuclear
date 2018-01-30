import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class VolumeSlider extends React.Component {

  handleClick(event) {
    this.props.handleClick(this.slider.offsetWidth)(event);
  }
  
  render() {
    return (
      <div
	onClick={this.handleClick.bind(this)}
	className={styles.volume_slider_container}
	ref={slider => {this.slider = slider;}}
	>
        <div className={styles.volume_slider_bg}></div>
        <div style={{width: this.props.fill}} className={styles.volume_slider_fill}></div>
      </div>
    );
  }
}

export default VolumeSlider;

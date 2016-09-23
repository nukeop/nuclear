import React from 'react';
import ClassNames from 'classnames';

class Player extends React.Component{

  render() {

    const playPauseClass = ClassNames({
      'fa fa-play': this.props.playStatus == 'PLAYING' ? false : true,
      'fa fa-pause': this.props.playStatus == 'PLAYING' ? true : false
    });

    const seekBarStyle = {
      width: (this.props.progress*100)+"%"
    };

    const volumeBarStyle = {
      width: '100px'
    };

    return(
      <div className="navbar navbar-fixed-bottom">

        <ul className="nav navbar-nav navbar-left">
          <li><button type="button" className="btn btn-link navbar-btn player-buttons"><i className="fa fa-step-backward" aria-hidden="true"></i></button></li>
        <li><button type="button" className="btn btn-link navbar-btn player-buttons play-button" onClick={this.props.togglePlayCallback}><i className={playPauseClass} aria-hidden="true"></i></button></li>
        <li><button type="button" className="btn btn-link navbar-btn player-buttons" onClick={this.props.nextCallback}><i className="fa fa-step-forward" aria-hidden="true"></i></button></li>
        </ul>

        <ul className="nav navbar-nav">
          <li><p className="seekbar-text">{this.props.elapsed}</p></li>
        </ul>

        <ul className="nav navbar-nav">
          <li>
            <div className="progress seekbar">
              <div className="progress-bar seekbar-bar" role="progressbar" aria-valuenow="70"
                   aria-valuemin="0" aria-valuemax="100" style={seekBarStyle}>
              </div>
            </div>
          </li>
        </ul>

        <ul className="nav navbar-nav navbar-right" >
          <li>
            <button type="button" className="btn btn-link navbar-btn player-buttons">
              <i className="fa fa-volume-up" aria-hidden="true"></i>
            </button>
          </li>
          <div className="progress volume-bar">
            <div className="progress-bar seekbar-bar" role="progressbar" aria-valuenow="30"
                 aria-valuemin="0" aria-valuemax="100" style={volumeBarStyle}>
            </div>
          </div>
        </ul>

      </div>
    );
  }

}

export default Player;

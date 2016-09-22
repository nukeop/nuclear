import React from 'react';

class YoutubeSongList extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    var _this=this;
    return (
        <div className="scrolling-table">
        <table className="table table-hover table-condensed">
        <thead>
        <tr>
        <th><i className="fa fa-picture-o" aria-hidden="true"></i></th>
        <th>Title</th>
        <th>Length</th>
        <th />
        </tr>
        </thead>

        <tbody>
        {
          this.props.songs.map(function(song, i){
          return (
              <tr>
              <td className="vert-align"><img src={song.thumbnail} height="90" width="120" /></td>
              <td className="vert-align">{song.title}</td>
              <td className="vert-align">{song.length}</td>
              <td className="vert-align"><button className="btn btn-link" onClick={_this.props.addToQueue.bind(_this.props.appContainer, song)}><i className="fa fa-play-circle" aria-hidden="true"></i></button>
</td>
              </tr>
          );
        })}
      </tbody>
        </table>
        </div>
    );
  }
}

export default YoutubeSongList;

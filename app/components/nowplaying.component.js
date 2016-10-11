import React from 'react';

import { ContextMenu, Item, Separator, menuProvider } from 'react-contexify';

function onClick(item, target){
  console.log(item);
  console.log(target);

  console.log(item.props.label);
  console.log(this.props);
}


class NowPlaying extends React.Component {
  constructor(props){
    super(props);
  }

  loadingIcon(){
    if(this.props.loading){
      return (
          <i className="fa fa-spinner fa-pulse fa-fw"></i>
      );
    } else {
      return [];
    }
  }

  deleteByName(item, target){
    console.log(this.props);
    console.log(target);
    console.log(target.id);
  }

  nowPlayingMenu(){
    return(
        <ContextMenu id='menu_id'>
        <Item label="Delete" icon="fa fa-trash" onClick={this.deleteByName.bind(this)} />
        <Separator />
        <Item label="Clear queue" icon="fa fa-remove" onClick={this.props.clearQueueCallback}/>
        </ContextMenu>
    );
  }

  render() {
    var _this=this;
    return(
        <div className="col-md-4 now-playing">
        {this.nowPlayingMenu()}
        <div className="panel panel-default">
        <div className="panel-heading">
        Now playing {this.loadingIcon()}
      </div>
        <table className="table table-hover table-condensed">
        <thead>
        <tr>
        <th>#</th>
        <th>Title</th>
        <th>Length</th>
        </tr>
        </thead>

        <tbody>
        {this.props.queue.map(function(song, i){
          var rowClass="";
          if (i==_this.props.currentSong){
            rowClass = "info";
          }

          return (
              <tr className={rowClass}>
              <td>{i+1}.</td>
              <td>{song.title}</td>
              <td>{song.length}</td>
              </tr>
          );
        })}
      </tbody>

        </table>
        </div>
        </div>
    );
  }
}

const NowPlayingWithMenu = menuProvider('menu_id')(NowPlaying);

export default NowPlayingWithMenu;

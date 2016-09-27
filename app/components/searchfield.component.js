import React from 'react';

class SearchField extends React.Component{
  constructor(props){
    super(props);
  }

  renderInputField(){
    if (this.props.searchTerms!=""){
      return(
          <input type="text" id="searchField" className="form-control searchfield" placeholder="Search" onKeyPress={this.props.handleSearch}/>
      );
    } else {
      return(
          <input type="text" id="searchField" className="form-control searchfield" placeholder="Search" onKeyPress={this.props.handleSearch}/>
      );
    }
  }

  render() {
    const hidden = {
      display: 'none'
    };

    const st = {
      margin: "6px",
      "borderBottom": "5px"
    };

    return (
          <div className="form-group searchfield-group">
            <div className="input-group">
        <div className="input-group-addon searchicon"><i className="fa fa-search" aria-hidden="true"></i></div>
        {this.renderInputField()}
            </div>
          </div>

    );

  }

}


export default SearchField;

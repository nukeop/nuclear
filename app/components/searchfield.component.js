import React from 'react';

class SearchField extends React.Component{
  constructor(props){
    super(props);
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
        <input type="text" id="searchField" className="form-control searchfield" placeholder="Search" onKeyPress={this.props.handleSearch}/>

    );

  }

}


export default SearchField;

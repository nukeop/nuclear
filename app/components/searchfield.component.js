import React from 'react';

class SearchField extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    const hidden = {
      display: 'none'
    };

    return (
      <div className="form-group">
        <input type="text" id="searchField" className="form-control navbar-search" placeholder="Search" onKeyPress={this.props.handleSearch}/>
      </div>
    );

  }

}


export default SearchField;

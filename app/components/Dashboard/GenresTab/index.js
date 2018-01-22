import React from 'react';

import styles from './styles.scss';

class GenresTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      genres
    } = this.props;
    return (
      <div>
	{
	  genres.map((tag, i) => {
	    return (
              <div>
		{tag.name}
	      </div>
	    );
	  })
	}
      </div>
    );
  }
}

export default GenresTab;

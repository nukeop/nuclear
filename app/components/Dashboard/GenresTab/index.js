import React from 'react';
import {Tab} from 'semantic-ui-react';

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
      <Tab.Pane attached={false}>
        <div className={styles.genre_tab_container}>
	  {
	    genres !== undefined
	    ? genres.slice(0, 8).map((tag, i) => {
	      return (
		<div
		  className={styles.genre_container}
		  key={i}
		  >
                  <div className={styles.genre_bg}>
		  </div>
                  <div className={styles.genre_name}>
		    {tag.name}
		  </div>
		</div>
	      );
	    })
	  : null
	}
      </div>
	</Tab.Pane>
    );
  }
}

export default GenresTab;

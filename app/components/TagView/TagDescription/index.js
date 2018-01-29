import React from 'react';

import styles from './styles.scss';

class TagDescription extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      tagInfo
    } = this.props;
    
    return (
      <div className={styles.tag_description}>
	{tagInfo.wiki.summary.split('.').slice(0, -5).join('.')+'...'}
      </div>
    );
  }
}

export default TagDescription;

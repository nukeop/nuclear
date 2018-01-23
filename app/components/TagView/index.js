import React from 'react';

import styles from './styles.scss';

class TagView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadTagInfo(this.props.tag);
  }

  render() {
    let {
      loadTagInfo,
      tag,
      tags
    } = this.props;
    
    return (
      <div>
	{tag}
      </div>
    );
  }
}

export default TagView;

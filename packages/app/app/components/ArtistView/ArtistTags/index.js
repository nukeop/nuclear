import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';

import styles from './styles.scss';

const ArtistTags = ({
  tags,
  onTagClick
}) => (
  <div className={styles.tags_container}>
    {
      tags && tags.length > 0 &&
        tags.map((tag, i) => {
          return (
            <a
              href='#'
              onClick={() => onTagClick(tag)}
              key={i}
              className={styles.tag}
            >#{tag}</a>
          );
        })
    }
  </div>
);

ArtistTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
};

export default compose(
  withRouter,
  withHandlers({
    onTagClick: ({ history }) => tag => history.push(`/tag/${tag}`)
  })
)(ArtistTags);

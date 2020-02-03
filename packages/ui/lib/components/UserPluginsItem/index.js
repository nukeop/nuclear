import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Icon } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

const UserPluginsItem = ({
  path,
  name,
  description,
  image,
  author,
  loading,
  error,
  handleDelete,
  handleAuthorClick
}) => (
  <div
    className={cx(
      common.nuclear,
      styles.user_plugins_item,
      { loading, error }
    )}
  >
    {
      image && !loading &&
      <div className={styles.plugin_icon}>
        <img src={image}/>
      </div>
    }
    {
      loading &&
        <div className={styles.plugin_icon}>
          <Loader type='small' />
        </div>
    }

    <div className={styles.plugin_info}>
      <div className={styles.plugin_name}>
        {name}
      </div>
      <div className={styles.plugin_path}>
        <label>Installed from:</label>
        <span>{path}</span>
      </div>
      <div className={styles.plugin_description}>
        {description}
      </div>

      <div className={styles.plugin_footer}>
        <div className={styles.plugin_author}>
          <label>Author:</label>
          <span className={styles.link} onClick={handleAuthorClick}>
            {author}
          </span>
        </div>
        <Button basic inverted icon
          className={styles.delete_button}
          onClick={handleDelete}
        >
          <Icon name='trash alternate outline'/>
          Uninstall
        </Button>
      </div>

      <div className={styles.error_footer}>
        {
          error &&
            <div className={styles.error_message}>
              This plugin could not be loaded correctly.
            </div>
        }
      </div>
    </div>
  </div>
);

UserPluginsItem.propTypes = {
  path: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(null)
  ]),
  author: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  deleteUserPlugin: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  onAuthorClick: PropTypes.func
};

export default compose(
  withHandlers({
    handleDelete: ({path, deleteUserPlugin}) => () => {
      deleteUserPlugin(path);
    },
    handleAuthorClick: ({author, onAuthorClick}) => () => {
      onAuthorClick(author);
    }
  })
)(UserPluginsItem);

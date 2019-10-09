import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Icon } from 'semantic-ui-react';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

const UserPluginsItem = ({
  path,
  name,
  description,
  image,
  loading,
  error,
  handleDelete
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
      <div className={styles.delete_button_box}>
        <Button basic inverted icon
          className={styles.delete_button}
          onClick={handleDelete}
        >
          <Icon name='trash alternate outline' size='large'/>
        </Button>
      </div>
      {
        error &&
        <div className={styles.error_message}>
        This plugin could not be loaded correctly.
        </div>
      }
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
  loading: PropTypes.bool,
  error: PropTypes.bool,
  handleDelete: PropTypes.func
};

export default UserPluginsItem;

import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from 'semantic-ui-react';

import styles from './styles.scss';

const SocialIntegration = props => {
  const {
    logo,
    title,
    description,
    children
  } = props;
  
  return (
    <React.Fragment>
      <Grid className={ styles.social_integration }>
        <Grid.Column>
          <Grid.Row>
            <span>
              { logo }
            </span>
            <span>
              { title }
            </span>
          </Grid.Row>
          <Grid.Row>
            <p>
              { description }
            </p>
          </Grid.Row>
        </Grid.Column>
      </Grid>
      { children }
    </React.Fragment>
  );
};

SocialIntegration.propTypes = {
  logo: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node
};

SocialIntegration.defaultProps = {
  logo: null,
  title: '',
  description: '',
  children: null
};

export default SocialIntegration;

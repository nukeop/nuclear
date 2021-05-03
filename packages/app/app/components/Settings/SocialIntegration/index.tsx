import React from 'react';
import { Grid } from 'semantic-ui-react';

import styles from './styles.scss';

type SocialIntegrationProps = {
  logo: React.ReactElement;
  title: string;
  description: string;
};

const SocialIntegration: React.FC<SocialIntegrationProps> = ({
  logo,
  title,
  description,
  children
}) => (
  <>
    <Grid className={styles.social_integration}>
      <Grid.Column>
        <Grid.Row>
          <span>{logo}</span>
          <span>{title}</span>
        </Grid.Row>
        {
          description &&
          <Grid.Row>
            <p>{description}</p>
          </Grid.Row>
        }
      </Grid.Column>
    </Grid>
    {children}
  </>
);

export default SocialIntegration;

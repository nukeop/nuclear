import React from 'react';
import { Button } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';

const shell = require('electron').shell;

const ArtistLink = ({ artistLink, size }) => (
  <Button
    primary
    onClick={() => shell.openExternal(artistLink)}
    size={size}
    // className={styles.add_button}
    aria-label={'Visit Artist Profile'}
  >
    <FontAwesome name='link' /> Visit
  </Button>
);

export default ArtistLink;

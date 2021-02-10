import React from 'react';
import { Button } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';

const shell = require('electron').shell;

const ArtistLink = ({ artistLink, size, label='Visit', circular=false}) => (
  <Button
    primary
    onClick={() => shell.openExternal(artistLink)}
    size={size}
    circular={circular}
    aria-label={'Visit Artist Profile'}
  >
    <FontAwesome name='link' /> {label}
  </Button>
);

export default ArtistLink;

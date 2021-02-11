import React from 'react';
import { Button } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';
import { useTranslation } from 'react-i18next';

const ArtistLink = ({ artistLink, size, circular=false}) => {

  const shell = require('electron').shell;
  const { t } = useTranslation('artist');
  const openExternal = React.useCallback(() => shell.openExternal(artistLink), [artistLink, shell]);


  return (<Button
    primary
    onClick={openExternal}
    size={size}
    circular={circular}
    aria-label={'Visit Artist Profile'}
  >
    <FontAwesome name='link' /> {t('link')}
  </Button>);
};

export default ArtistLink;

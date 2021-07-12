import React from 'react';
import { useSelector } from 'react-redux';

import HelpModal from '../../components/HelpModal';
import { ContributorProps } from '../../components/HelpModal/Contributors';
import { githubContribSelectors } from '../../selectors/githubContrib';

const HelpModalContainer: React.FC<{}> = () => {

  const githubContrib: ContributorProps = {
    contributors: useSelector(githubContribSelectors.contributors),
    loading: useSelector(githubContribSelectors.loading),
    error: useSelector(githubContribSelectors.error)
  };

  return (<HelpModal githubContrib={githubContrib} />);
};

export default HelpModalContainer;

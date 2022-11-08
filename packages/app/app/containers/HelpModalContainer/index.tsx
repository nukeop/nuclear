import React from 'react';
import { useSelector } from 'react-redux';
import electron from 'electron';

import HelpModal from '../../components/HelpModal';
import { ContributorState } from '../../components/HelpModal/Contributors';
import { githubContribSelectors } from '../../selectors/githubContrib';

const HelpModalContainer: React.FC<{}> = () => {

  const githubContrib: ContributorState = {
    contributors: useSelector(githubContribSelectors.contributors),
    loading: useSelector(githubContribSelectors.loading),
    error: useSelector(githubContribSelectors.error)
  };

  const handleOpenExternalLink = (link: string) => link && link.length && electron.shell.openExternal(link);
  const handleMastodonClick = () => handleOpenExternalLink('https://fosstodon.org/@nuclearplayer');
  const handleGithubClick = () => handleOpenExternalLink('https://github.com/nukeop/nuclear');
  const handleTwitterClick = () => handleOpenExternalLink('https://twitter.com/nuclear_player');
  const handleAuthorClick = () => handleOpenExternalLink('https://github.com/nukeop');
  const handleDiscordClick = () => handleOpenExternalLink('https://discord.gg/JqPjKxE');
  const handleReportIssueClick = () => handleOpenExternalLink(
    'https://github.com/nukeop/nuclear/issues/new?assignees=&labels=bug&template=bug_report.md&title='
  );

  return (<HelpModal
    githubContrib={githubContrib}
    handleOpenExternalLink={handleOpenExternalLink}
    handleMastodonClick={handleMastodonClick}
    handleGithubClick={handleGithubClick}
    handleTwitterClick={handleTwitterClick}
    handleAuthorClick={handleAuthorClick}
    handleDiscordClick={handleDiscordClick}
    handleReportIssueClick={handleReportIssueClick}
  />);
};

export default HelpModalContainer;

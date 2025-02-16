import React from 'react';
import { Loader, Card, Image } from 'semantic-ui-react';
import styles from './styles.scss';

export type GithubContributorData = {
  total: number;
  author: {
    id: string;
    html_url: string;
    avatar_url: string;
    login: string;
  };
};

export type ContributorState = {
  loading: boolean;
  error: boolean;
  contributors: Array<GithubContributorData>;
}
export type ContributorProps = {
  handleOpenExternalLink: (link: string) => void;
} & ContributorState;

const Contributors: React.FC<ContributorProps> = ({
  loading,
  error,
  contributors = [],
  handleOpenExternalLink
}) => {
  if (loading) {
    return <Loader className={styles.contributors_loader} />;
  }

  if (error) {
    return (
      <div className={styles.contributors_error}>
        There was an error loading contributors from Github
      </div>
    );
  }

  const top10 = contributors
    .sort((a, b) => b.total - a.total)
    .filter(contributor => Boolean(contributor.author))
    .slice(0, 10)
    .map((contributor) => {
      return (
        <Card
          href='#'
          className={styles.contributors_card}
          key={contributor.author?.id}
          onClick={() =>
            handleOpenExternalLink(contributor.author?.html_url)
          }
        >
          <Card.Content>
            <Image
              floated='right'
              size='mini'
              src={contributor.author?.avatar_url}
            />
            <Card.Header>{contributor.author?.login}</Card.Header>
            <Card.Meta>
              {contributor.author?.html_url}
            </Card.Meta>
            <Card.Description>
              <strong>{contributor.total}</strong> contributions.
            </Card.Description>
          </Card.Content>
        </Card>
      );
    });

  return (
    <Card.Group centered={true} itemsPerRow={2}>
      {top10}
    </Card.Group>
  );
};

export default Contributors;

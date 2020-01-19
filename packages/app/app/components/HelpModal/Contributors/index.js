import React from 'react';
import { Loader, Card, Image } from 'semantic-ui-react';
import styles from './styles.scss';

const Contributors = ({
  loading,
  error,
  contributors,
  handleGithubClick
}) => {
  if (loading) {
    return <Loader className={styles.contributors_loader} />;
  }

  if (error) {
    return <div className={styles.contributors_error}>There was an error loading contributors from Github</div>;
  }

  const top10 = contributors.sort((a, b) => b.total - a.total).slice(0, 10).map((contributor) => {
    return (
      <Card
        href='#'
        className={styles.contributors_card}
        key={contributor.author.id}
        onClick={() => handleGithubClick(contributor.author.html_url)}
        >
          <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={contributor.author.avatar_url}
          />
          <Card.Header>{contributor.author.login}</Card.Header>
          <Card.Meta className={styles.meta_text}>{contributor.author.html_url}</Card.Meta>
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
}

Contributors.defaultProps = {
  contributors: []
};

export default Contributors;
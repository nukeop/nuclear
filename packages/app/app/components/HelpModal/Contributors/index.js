import React from 'react';
import { Loader, Card, Image } from 'semantic-ui-react';
import styles from './styles.scss';

export default function Contributors(props) {
  const { loading, error, contributors} = props;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.warn(error);
    return <div>Errors when loading contributors from github...</div>;
  }

  const top10 = contributors.sort((a, b) => b.total - a.total).slice(0, 10).map((contributor) => {
    return (
      <div
        className={styles.contributors_card_container} 
        key={contributor.author.id}>
        <Card
          href='#'
          onClick={() => props.handleGithubClick(contributor.author.html_url)}
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
      </div>
    );
  });

  return ( 
    <Card.Group centered={true}>
      {top10}
    </Card.Group>
  );
}

Contributors.defaultProps = {
  contributors: []
};

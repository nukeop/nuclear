import React from 'react';
import { Loader, Card, Image } from 'semantic-ui-react';

export default function Contributors(props) {
  const { loading, error, contributors} = props;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.warn(error);
    return <div>Errors when loading contributors from github...</div>;
  }

  const top10 = contributors.map((contributor) => {
    return (
      <div key={contributor.id}>
        <Card>
          <Card.Content>
            <Image
              floated='right'
              size='mini'
              src={contributor.avatar_url}
            />
            <Card.Header>{contributor.login}</Card.Header>
            <Card.Meta>{contributor.html_url}</Card.Meta>
            <Card.Description>
            Contributed <strong>{contributor.total}</strong>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  });

  return <Card.Group>{top10}</Card.Group>;
}

Contributors.defaultProps = {
  contributors: []
};

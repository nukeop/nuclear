import React from 'react';

type PromotedArtistProps = {
    name: string;
}

// Stub
const PromotedArtist: React.FC<PromotedArtistProps> = ({
  name
}) => {
  return <div>{name}</div>;
};

export default PromotedArtist;

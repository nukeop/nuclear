import React from 'react';
import { PromotedArtist } from '../..';

export default {
  title: 'Components/Promoted Artist'
};

export const OnlyName = () => (
  <div className='bg'>
    <PromotedArtist
      name='Test artist'
      imageUrl='https://via.placeholder.com/300'
      externalUrl='https://nuclear.js.org'
      onListenClick={() => {}}
    />
  </div>
);

export const WithDescription = () => (
  <div className='bg'>
    <PromotedArtist
      name='Test artist'
      description='Test description'
      imageUrl='https://via.placeholder.com/300'
      backgroundImageUrl='https://via.placeholder.com/600x250'
      externalUrl='https://nuclear.js.org'
      onListenClick={() => {}}
    />
  </div>
);

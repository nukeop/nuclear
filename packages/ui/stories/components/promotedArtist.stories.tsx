import React from 'react';
import { PromotedArtist } from '../..';

export default {
  title: 'Components/Promoted Artist'
};

export const OnlyName = () => (
  <div className='bg'>
    <PromotedArtist
      name='Test artist'
    />
  </div>
);

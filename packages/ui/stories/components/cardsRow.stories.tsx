import { fill } from 'lodash';
import React from 'react';
import { CardsRow } from '../..';

export default {
  title: 'Components/Card Row'
};

export const NotFull = () => (
  <div className='bg'>
    <CardsRow 
      header='Popular albums'
      cards={[{
        header: 'In The Aeroplane Over The Sea',
        content: 'Neutral Milk Hotel',
        image: 'https://i.imgur.com/4euOws2.jpg'
      }, {
        header: 'Dark Side of The Moon',
        content: 'Pink Floyd',
        image: 'https://i.imgur.com/koC6Otx.jpg'
      }]}
      filterPlaceholder='Filter albums...'
    />
  </div>
);

export const Scrolling = () => (
  <div className='bg'>
    <CardsRow
      header='Popular albums'
      cards={
        fill(
          Array(10),
          {
            header: 'Title',
            content: 'Content',
            image: 'https://i.imgur.com/4euOws2.jpg'
          })
      }
    />
  </div>
);

import { getChart } from 'billboard-top-100';

export const lists = {
  genres: [
    {
      name: 'Mainstream Top 40',
      link: 'pop-songs'
    },
    {
      name: 'Adult Contemporary',
      link: 'adult-contemporary'
    },
    {
      name: 'Adult Top 40',
      link: 'adult-pop-songs'
    }
    
  ]
};

export function getTop(list) {
  return new Promise((resolve, reject) => {
    getChart(list, (songs, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(songs);
      }
    });
  });
}

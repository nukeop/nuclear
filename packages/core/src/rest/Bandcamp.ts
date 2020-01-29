/*
eslint-disable
*/
import bandcamp from 'bandcamp-scraper';

export const search = query => {
  bandcamp.search({ query, page: 1 }, (err, results) => {
    console.log(results);
  });
};

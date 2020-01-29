/*
eslint-disable
*/
import bandcamp from 'bandcamp-scraper';

export const search = (query, callback) => {
  bandcamp.search({ query, page: 1 }, callback);
};

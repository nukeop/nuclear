const nuclearNewsUrl = 'http://nuclear.js.org/news/';

export function getNewsIndex() {
  return fetch(nuclearNewsUrl)
    .then(response => response.json())
    .then(response => {
      return Promise.resolve(response);
    })
    .catch(err => {
      console.error(err);
    });
}

export function getNewsItem(itemName) {
  return fetch(nuclearNewsUrl + itemName)
    .then(response => response.json())
    .then(response => {
      return Promise.resolve(response);
    })
    .catch(err => {
      console.error(err);
    });
}

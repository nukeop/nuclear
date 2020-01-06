/* eslint-disable no-console */
export default {
  name: 'test plugin',
  description: 'test plugin description',
  image: null,
  author: 'nukeop',
  onLoad: api => {
    console.log('Plugin started');
    console.log(api);
  }
};

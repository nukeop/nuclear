import rock from '../../../../resources/musicgenresicons/outline/svg/rock.svg';

export default genre => {
  switch (genre) {
  case 'rock':
    return rock;
  default:
    return null;
  }
};

import eighties from '../../../../resources/musicgenresicons/outline/80\'s.svg';
import nineties from '../../../../resources/musicgenresicons/outline/90\'s.svg';
import acoustic from '../../../../resources/musicgenresicons/outline/acoustic.svg';
import blues from '../../../../resources/musicgenresicons/outline/blues.svg';
import chillout from '../../../../resources/musicgenresicons/outline/chill_out.svg';
// import childrens from '../../../../resources/musicgenresicons/outline/childrens_music.svg';
// import christmas from '../../../../resources/musicgenresicons/outline/christmas_carols.svg';
import classical from '../../../../resources/musicgenresicons/outline/classical.svg';
import country from '../../../../resources/musicgenresicons/outline/country.svg';
import disco from '../../../../resources/musicgenresicons/outline/disco.svg';
import edm from '../../../../resources/musicgenresicons/outline/edm.svg';
// import ethnic from '../../../../resources/musicgenresicons/outline/ethnic.svg';
import exercise from '../../../../resources/musicgenresicons/outline/exercise.svg';
// import gospel from '../../../../resources/musicgenresicons/outline/gospel.svg';
import hiphop from '../../../../resources/musicgenresicons/outline/hip_hop.svg';
import hippie from '../../../../resources/musicgenresicons/outline/hippie.svg';
import indie from '../../../../resources/musicgenresicons/outline/indie.svg';
import jazz from '../../../../resources/musicgenresicons/outline/jazz.svg';
// import kpop from '../../../../resources/musicgenresicons/outline/k-pop.svg';
// import latin from '../../../../resources/musicgenresicons/outline/latin.svg';
import metal from '../../../../resources/musicgenresicons/outline/metal.svg';
import pop from '../../../../resources/musicgenresicons/outline/pop.svg';
import punk from '../../../../resources/musicgenresicons/outline/punk.svg';
import rnb from '../../../../resources/musicgenresicons/outline/R&B.svg';
// import reggae from '../../../../resources/musicgenresicons/outline/reggae.svg';
import rock from '../../../../resources/musicgenresicons/outline/rock.svg';
// import romantic from '../../../../resources/musicgenresicons/outline/romantic.svg';
// import tango from '../../../../resources/musicgenresicons/outline/tango.svg';
import trending from '../../../../resources/musicgenresicons/outline/trending.svg';
import vocal from '../../../../resources/musicgenresicons/outline/vocal.svg';

const genreToIcon = (genre: string): string => {
  switch (genre.toLowerCase()) {
  case 'blues':
    return blues;
  case 'rock':
  case 'classic rock':
  case 'post-rock':
  case 'progressive rock':
    return rock;
  case 'country':
    return country;
  case 'exercise':
  case 'workout':
    return exercise;
  case 'electronic':
  case 'electronica':
  case 'trance':
    return edm;
  case 'alternative':
  case 'alternative rock':
  case 'british':
  case 'german':
  case 'japanese':
  case 'indie':
  case 'indie rock':
  case 'new wave':
    return indie;
  case 'pop':
    return pop;
  case 'hard rock':
  case 'metal':
  case 'metalcore':
  case 'black metal':
  case 'death metal':
  case 'heavy metal':
  case 'progressive metal':
  case 'thrash metal':
  case 'industrial':
    return metal;
  case 'funk':
  case 'jazz':
    return jazz;
  case 'singer-songwriter':
  case 'female vocalists':
    return vocal;
  case 'acoustic':
  case 'folk':
    return acoustic;
  case 'punk':
  case 'punk rock':
  case 'hardcore':
    return punk;
  case 'hip-hop':
  case 'hip hop':
  case 'rap':
    return hiphop;
  case 'classical':
  case 'instrumental':
  case 'soundtrack':
    return classical;
  case 'dance':
    return disco;
  case 'psychedelic':
    return hippie;
  case '80s':
    return eighties;
  case '90s':
    return nineties;
  case 'soul':
    return rnb;
  case 'chillout':
    return chillout;
  case 'ambient':
  case 'experimental':
  default:
    return trending;
  }
};

export default genreToIcon;

import React from 'react';
import styles from './styles.scss';
import { MusicContentTrackAndAlbum } from '..';
import { History } from 'history';


interface BestNewMusicContentProps {
  item: MusicContentTrackAndAlbum;
  albumInfoSearchByName: (albumName: string, artistName: string, history: History) => void;
  artistInfoSearchByName: (artistName: string, history: History) => void;
  history: History;
}

const BestNewMusicContent: React.FC<BestNewMusicContentProps> = ({
  item,
  albumInfoSearchByName,
  artistInfoSearchByName,
  history
}) => {
  if (item === null) {
    return null;
  }

  return (
    <div className={styles.best_new_music_content}>
      <div className={styles.review_header}>
        <div className={styles.thumbnail}>
          <img alt={item.title} src={item.thumbnail} />
        </div>
        <div className={styles.review_headings}>
          <div
            className={styles.artist}
            onClick={() => artistInfoSearchByName(item.artist, history)}
          >
            {item.artist}
          </div>
          <div
            className={styles.title}
            onClick={() => albumInfoSearchByName(item.title, item.artist,  history)}
          >
            {item.title}
          </div>
        </div>
        {
          item.score &&
          <div className={styles.score}>
            <div className={styles.score_box}>
              {item.score}
            </div>
          </div>
        }
      </div>
      {
        item.review.split('\n').map((paragraph, i) => {
          return (
            <p key={'item-' + i} className={styles.paragraph}>
              {paragraph}
            </p>
          );
        })
      }
    </div>
  );
};

export default BestNewMusicContent;

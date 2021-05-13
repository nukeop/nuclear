import React from 'react';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';
import { jsPDF} from 'jspdf';

type LyricsViewProps = {
  lyricsSearchResults: {
    type: string;
  };
  track?: {
    name: string;
    artist: string;
  };
  
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  lyricsSearchResults,
  track
}) => {
  const { t } = useTranslation('lyrics');
  let lyricsStr = _.get(lyricsSearchResults, 'type', '');
  if (lyricsStr === '') {
    lyricsStr = t('not-found');
  }

  return <div className={styles.lyrics_view}>
    {
      !track &&
      <div className={styles.empty_state}>
        <Icon name='music' />
        <h2>{t('empty')}</h2>
        <div>{t('empty-help')}</div>
      </div>
    }
    {
      Boolean(track) &&
      <> 
        <LyricsHeader
          name={track.name}
          artist={track.artist}
        />
        <button onClick={createPDF} className=".export_button"> Download PDF</button> 
        <div className={styles.lyrics_text}>
          {lyricsStr}
        </div>
        <button onClick={createPDF} className=".export_button"> Download PDF</button> 
      </>
    }
  </div>;

  function createPDF () {
    let pdf = new jsPDF();

    let margins =  {
      top: 9,
      left: 10
    };
    

    pdf.setFont("Calibri", "Bold");
    pdf.setFontSize(16);
    let name = track.name
    let artist = track.artist
    pdf.text(name + " - " + artist, margins.left, margins.top);


    let lyrics = lyricsStr;
    let lyricsOfThePage = "";
	  let nbrLineBreak = 0;
	  
	  for(let i = 0; i < lyrics.length; i++){
		  lyricsOfThePage += lyrics[i];
		  
		  //At the end of each line, increase the number of line passed
		  if(lyrics[i] == '\n'){
			  nbrLineBreak++;
		  }
		  
		  //When 40 lines are passed
		  //Add the lyrics en the current page, add a new page and continue the lyrics on it
		  //Resets to default values of nbrLineBreak and lyricsOfThePage
		  if(nbrLineBreak == 40){
			  pdf.text(lyricsOfThePage, margins.left, margins.top+10);
			  pdf.addPage();
			  nbrLineBreak = 0;
			  lyricsOfThePage = "";
		  }
	  }

    
    return  pdf.save('datauristring.pdf');
    {lyricsStr}
    {this.createPDF}
    


  }
};

export default LyricsView;
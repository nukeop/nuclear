import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';

///
import { jsPDF } from 'jspdf';


export class LyricsView extends React.Component {
  constructor(props) {
    super(props);
	///
	this.pdfToHTML = this.pdfToHTML.bind(this);
  }

  renderLyrics () {
    const lyrics = this.props.lyrics;
    let lyricsStr = _.get(lyrics, 'lyricsSearchResults', '');
    lyricsStr = _.get(lyricsStr, 'type', '');
    if (lyricsStr === '') {
      lyricsStr = this.props.t('not-found');
	}
	
	//Changes by WildLeons
	if(lyricsStr === this.props.t('not-found')) {
		return (
			<div className={styles.lyrics_text}>
				{lyricsStr}
			</div>
		);
	}
	else{
		return(
		<>
		<div className={styles.lyrics_text}>
			{lyricsStr}
		</div>
		
		<div className={styles.button_container}>
		<a href='#' className={styles.export_button} onClick={this.pdfToHTML}>
			{this.props.t('export-lyrics')}
		</a>
		</div>
		</>
		);
	}
  }

  renderLyricsHeader () {
	  const track = this.props.track;
    return (
      <LyricsHeader
        name={track.name}
        artist={track.artist}
      />
	);
  }

  renderNoSelectedTrack () {
    return (
      <div className={styles.empty_state}>
        <FontAwesome name='music'/>
        <h2>{this.props.t('empty')}</h2>
        <div>{this.props.t('empty-help')}</div>
      </div>
    );
  }
  
  //Addition of WildLeons
  
  pdfToHTML () {
	  //Creation of a PDF file with portrait orientation and a measurement unit of millimeter
	  let pdf = new jsPDF('p', 'mm');
	  
	  //Retrieve the lyrics only from the props.lyrics like in renderLyrics()
	  let lyrics = _.get(this.props.lyrics, 'lyricsSearchResults', '');
	  lyrics = _.get(lyrics, 'type', '');
	  
	  //Get the name of the song and its artist
	  let name = this.props.track.name;
	  let artist = this.props.track.artist;
	  
	  //Margins for shaping
	  let margins = {
		  top: 50,
		  left: 50
	  };
	  
	  //Coordinates for the positions from the top left of the document
	  let x = 10;
	  let y = 10;
	  
	  //Add the name, artist and lyrics to the file and save the file.
	  pdf.text(name, x, y);
	  pdf.text(artist, x, y+20);
	  pdf.text(lyrics, x, y+50);
	  pdf.save(name + "_" + artist +"_Lyrics.pdf");
  }

  render () {
    const track = this.props.track;
    
    return (
      <div className={styles.lyrics_view}>
        {
          track === null &&
            this.renderNoSelectedTrack()
        }
        {
          track !== null &&
            this.renderLyricsHeader()
        }
        {
          track !== null &&
            this.renderLyrics()
        }		
      </div >
    );
  }
}


export default withTranslation('lyrics')(LyricsView);

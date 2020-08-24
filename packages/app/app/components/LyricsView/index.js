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
		<div className={styles.button_container}>
		<a href='#' className={styles.export_button} onClick={this.pdfToHTML}>
			{this.props.t('export-lyrics')}
		</a>
		</div>
		<br />
		<div className={styles.lyrics_text}>
			{lyricsStr}
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
	  //Creation of a PDF file
	  let pdf = new jsPDF();
	  
	  //Margins for shaping
	  let margins = {
		  top: 10,
		  left: 10
	  };
	  
	  //Get the name of the song and its artist and add them at the beginnig of the file
	  let name = this.props.track.name;
	  let artist = this.props.track.artist;
	  pdf.text(name + " - " + artist, margins.left, margins.top);
	  
	  //Retrieve the lyrics only from the props.lyrics like in renderLyrics()
	  let lyrics = _.get(this.props.lyrics, 'lyricsSearchResults', '');
	  lyrics = _.get(lyrics, 'type', '');
	  
	  //Add variables to store the lyrics that will be on a page
	  //and count the number of lines already passed before going to a next page
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
	  
	  //If after the loop, lyricsOfThePage is empty, delete the last page added which is empty
	  //Else add the last part of the lyrics
	  if(lyricsOfThePage == ""){
		  pdf.deletePage(pdf.internal.getNumberOfPages());
	  }
	  else{
		  pdf.text(lyricsOfThePage, margins.left, margins.top+10);
	  }
	  
	  //Save the file.
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

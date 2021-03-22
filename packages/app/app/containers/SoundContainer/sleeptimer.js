let props;
let sleeptimerSleepDate;
let sleeptimerTimeToSleep=0;

export function putToSleep (callProps) {
  props = callProps;
  const PERMITTEDDIFFERENCE= 5; 

  if (sleeptimerTimeToSleep !== props.settings.sleeptime){                      // sleep time setting was changed
    sleeptimerSleepDate = 'undefined';
  }

  if (sleeptimerSleepDate === 'undefined'){                                    // set sleeptimerSleepDate to pause time
    sleeptimerTimeToSleep = props.settings.sleeptime;    
    sleeptimerSleepDate = new Date(new Date().getTime() + sleeptimerTimeToSleep * 60 * 1000);     
  } else {                                                     
    if (new Date(((new Date().getTime()) - sleeptimerTimeToSleep) -sleeptimerSleepDate) >= PERMITTEDDIFFERENCE*60*1000){ // this will insure that sleeptimer was not turned off then back on at a later date and instantly pause the song 
      // (it will make sure it is turned off within PERMITTEDDIFFERENCE minutes of sleepdate being surpassed)
      sleeptimerSleepDate = 'undefined';
      return;
    }
        
    // sleeptimerSleepDate exists and is accurate so grab currentdate and compare 
    const currentDate = new Date(new Date().getTime());
    if (sleeptimerSleepDate < currentDate){                                  // if sleeptimerSleepDate passed then pause song and set sleeptimerSleepDate to undefine to reset sleeptimer
      sleeptimerSleepDate = 'undefined';
      props.settings.sleeptimerSwitch = false;
      props.actions.pausePlayback();
    }
  }
}


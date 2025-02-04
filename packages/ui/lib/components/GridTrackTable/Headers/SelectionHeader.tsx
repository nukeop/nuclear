import { HeaderProps, UseRowSelectInstanceProps } from 'react-table';

import { TrackTableExtraProps, TrackTableStrings } from '../../TrackTable/types';
import styles from '../styles.scss';
import React from 'react';
import Checkbox, { CheckboxProps } from '../../Checkbox';
import Button from '../../Button';
import ContextPopup from '../../ContextPopup';
import PopupButton from '../../PopupButton';
import { Track } from '../../../types';

export const SelectionHeader = <T extends Track>({
  getToggleAllRowsSelectedProps,
  selectedFlatRows,
  onAddToQueue,
  onPlayAll,
  onAddToFavorites,
  onAddToDownloads,
  strings
}: HeaderProps<T> & UseRowSelectInstanceProps<T> & TrackTableExtraProps<T> & { strings: TrackTableStrings }): React.ReactElement => {
  const checkboxProps = getToggleAllRowsSelectedProps();
  const selectedTracks = selectedFlatRows.map(row => row.original);
  
  return <div className={styles.selection_header}>
    {
      (checkboxProps.checked || checkboxProps.indeterminate) && <div className={styles.selection_header_buttons}>
        <ContextPopup
          title={`${selectedTracks.length} ${selectedTracks.length > 1 ? strings.tracksSelectedLabelPlural : strings.tracksSelectedLabelSingular}`}
          trigger={
            <Button 
              basic
              circular
              size='tiny'
              icon='ellipsis horizontal'
              className={styles.selection_header_popup_trigger}
              data-testid='select-all-popup-trigger'
            />
          }
        >
          <PopupButton
            ariaLabel={strings.addSelectedTracksToQueue}
            label={strings.addSelectedTracksToQueue}
            icon='plus'
            onClick={() => selectedTracks.forEach((track) => onAddToQueue(track))}
          />
          <PopupButton
            ariaLabel={strings.playSelectedTracksNow}
            label={strings.playSelectedTracksNow}
            icon='play'
            onClick={() => onPlayAll(selectedTracks)}
          />
          {
            onAddToFavorites &&
              <PopupButton
                ariaLabel={strings.addSelectedTracksToFavorites}
                label={strings.addSelectedTracksToFavorites}
                icon='heart'
                onClick={() => selectedTracks.forEach((track) => onAddToFavorites(track))}
              />
          }
          {
            onAddToDownloads &&
              <PopupButton
                ariaLabel={strings.addSelectedTracksToDownloads}
                label={strings.addSelectedTracksToDownloads}
                icon='download'
                onClick={() => selectedTracks.forEach((track) => onAddToDownloads(track))}
              />
          }
        </ContextPopup>
      </div>
    }
    <Checkbox {...(checkboxProps as unknown as CheckboxProps)} />
  </div>;
};

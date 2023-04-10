/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { HeaderProps, UseRowSelectInstanceProps } from 'react-table';

import { TrackTableExtraProps, TrackTableStrings } from '../types';
import { Button, Checkbox, ContextPopup, PopupButton } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const SelectionHeader: React.FC<
  HeaderProps<Track> &
  UseRowSelectInstanceProps<Track> &
  TrackTableExtraProps<Track> &
  { strings: TrackTableStrings }
> = ({
  getToggleAllRowsSelectedProps,
  selectedFlatRows,
  onAddToQueue,
  onPlayAll,
  onAddToFavorites,
  onAddToDownloads,
  strings
}) => {
  const checkboxProps = getToggleAllRowsSelectedProps();
  const selectedTracks = selectedFlatRows.map(row => row.original);


  return <span className={styles.select_header}>
    {
      (checkboxProps.checked || checkboxProps.indeterminate) &&
        <span className={styles.select_header_buttons}>
          <ContextPopup
            trigger={
              <Button 
                basic
                circular
                size='tiny'
                icon='ellipsis horizontal'
                data-testid='select-all-popup-trigger'
              />
            }
            title={`${selectedTracks.length} ${selectedTracks.length > 1 ? strings.tracksSelectedLabelPlural : strings.tracksSelectedLabelSingular}`}
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
        </span>
    }
    {/* @ts-ignore */}
    <Checkbox {...checkboxProps} />
  </span>;
};

export default SelectionHeader;

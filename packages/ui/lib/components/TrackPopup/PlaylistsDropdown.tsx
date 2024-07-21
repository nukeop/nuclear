import React, { useEffect, useState } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';

import { TrackPopupProps, TrackPopupStrings } from '.';
import PopupDropdown from '../PopupDropdown';
import FormInput from '../FormInput';
import styles from './styles.scss';

export type PlaylistsDropdownStrings = Pick<TrackPopupStrings, 'textAddToPlaylist' | 'textCreatePlaylist'>;

type PlaylistsDropdownProps = {
    playlists: TrackPopupProps['playlists'];
    strings: PlaylistsDropdownStrings;
    onAddToPlaylist: TrackPopupProps['onAddToPlaylist'];
    setIsCreatePlaylistDialogOpen: (value: boolean) => void;
}

export const PlaylistsDropdown: React.FC<PlaylistsDropdownProps> = ({ playlists=[], strings, onAddToPlaylist, setIsCreatePlaylistDialogOpen }) => {
  const [filter, setFilter] = useState('');
  const filterInputRef = React.createRef<HTMLInputElement>();
  const [isOpen, setOpen] = useState(false);
  const filteredPlaylists = playlists.filter(playlist => playlist.name.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    if (filterInputRef.current && isOpen) {
      filterInputRef.current.focus();
    }
  }, [filterInputRef.current, isOpen]);
  
  return <PopupDropdown
    className={styles.playlists_dropdown}
    data-testid='track-popup-add-playlist'
    pointing='left'
    text={strings.textAddToPlaylist}
    closeOnBlur={false}
    closeOnChange={false}
    onChange={() => {}}
    
    onOpen={() => {
      setFilter('');
      setOpen(true);
      filterInputRef.current?.focus();
    }}
    onClose={() => {
      setOpen(false);
    }}
  >
    <FormInput 
      value={filter}
      onChange={(value: string) => setFilter(value)}
      placeholder='Search playlists...'
      icon='filter'
      ref={filterInputRef}
    />
    <Dropdown.Divider />
    <Dropdown.Menu scrolling>
      {filteredPlaylists.map((playlist, i) => (
        <Dropdown.Item
          key={i}
          onClick={() => onAddToPlaylist(playlist)}
        >
          <Icon name='music' />
          {playlist.name}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
    <Dropdown.Divider />
    <Dropdown.Item
      onClick={() => {
        setIsCreatePlaylistDialogOpen(true);
      }}
      data-testid='track-popup-create-playlist'
    >
      <Icon name='plus' />
      {strings.textCreatePlaylist}
    </Dropdown.Item>
  </PopupDropdown>;
};

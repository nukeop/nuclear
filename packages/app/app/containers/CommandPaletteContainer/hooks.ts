import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CommandPaletteAction } from '@nuclear/ui/lib/components/CommandPalette';

import * as playerActions from '../../actions/player';
import * as settingsActions from '../../actions/settings';
import { nextSong, previousSong } from '../../actions/queue';
import * as windowActions from '../../actions/window';
import { useToggleOptionCallback } from '../PlayerBarContainer/hooks';
import { useTranslation } from 'react-i18next';
import { isMac } from '../../hooks/usePlatform';
import { playerSelectors } from '../../selectors/player';
import { settingsSelector } from '../../selectors/settings';

export const useCommandPaletteActions = (): CommandPaletteAction[] => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation('command-palette');
  const settings = useSelector(settingsSelector);
  const volume = useSelector(playerSelectors.volume);
  const toggleOption = useCallback(
    (option, state) => dispatch(settingsActions.toggleOption(option, state)), [dispatch]
  );

  const updateVolume = useCallback(
    (value) => {
      dispatch(playerActions.updateVolume(volume + value, false));
    },
    [dispatch, volume]
  );
  
  const toggleShuffle = useToggleOptionCallback(toggleOption, 'shuffleQueue', settings);
  const toggleRepeat = useToggleOptionCallback(toggleOption, 'loopAfterQueueEnd', settings);
  const toggleAutoradio = useToggleOptionCallback(toggleOption, 'autoradio', settings);
  
  const actions = () => {
    return [{
      id: 'play',
      name: t('actions.play'),
      shortcut: ['space'],
      icon: 'play',
      category: t('categories.playback'),
      onUse: () => dispatch(playerActions.startPlayback(false))
    }, {
      id: 'pause',
      name: t('actions.pause'),
      shortcut: ['space'],
      icon: 'pause',
      category: t('categories.playback'),
      onUse: () => dispatch(playerActions.pausePlayback(false))
    }, {
      id: 'next',
      name: t('actions.next'),
      shortcut: [isMac() ? '⌘ + →' : 'ctrl + →'],
      icon: 'forward',
      category: t('categories.queue'),
      onUse: () => dispatch(nextSong())
    }, {
      id: 'previous',
      name: t('actions.previous'),
      shortcut: [isMac() ? '⌘ + ←' : 'ctrl + ←'],
      icon: 'backward',
      category: t('categories.queue'),
      onUse: () => dispatch(previousSong())
    }, {
      id: 'go-to-next-page',
      name: t('actions.go-to-next-page'),
      shortcut: [isMac() ? '⌥ + →' : 'alt + →'],
      icon: 'chevron right',
      category: t('categories.navigation'),
      onUse: () => history.goForward()
    }, {
      id: 'go-to-previous-page',
      name: t('actions.go-to-previous-page'),
      shortcut: [isMac() ? '⌥ + ←' : 'alt + ←'],
      icon: 'chevron left',
      category: t('categories.navigation'),
      onUse: () => history.goBack()
    },
    {
      id: 'shuffle',
      name: t('actions.shuffle'),
      icon: 'random',
      category: t('categories.playback'),
      onUse: toggleShuffle
    }, {
      id: 'loop',
      name: t('actions.loop'),
      icon: 'repeat',
      category: t('categories.playback'),
      onUse: toggleRepeat
    }, {
      id: 'autoradio',
      name: t('actions.autoradio'),
      icon: 'magic',
      category: t('categories.playback'),
      onUse: toggleAutoradio
    }, {
      id: 'raise-volume',
      name: t('actions.raise-volume'),
      icon: 'volume up',
      category: t('categories.playback'),
      onUse: () => updateVolume(5)
    }, {
      id: 'lower-volume',
      name: t('actions.lower-volume'),
      icon: 'volume down',
      category: t('categories.playback'),
      onUse: () => updateVolume(-5)
    }, {
      id: 'quit',
      name: t('actions.quit'),
      icon: 'power off',
      category: t('categories.application'),
      onUse: () => dispatch(windowActions.closeWindow())
    }, {
      id: 'minimize',
      name: t('actions.minimize'),
      icon: 'window minimize',
      category: t('categories.application'),
      onUse: () => dispatch(windowActions.minimizeWindow())
    }, {
      id: 'maximize',
      name: t('actions.maximize'),
      icon: 'window maximize',
      category: t('categories.application'),
      onUse: () => dispatch(windowActions.maximizeWindow())
    }, {
      id: 'go-to-dashboard',
      name: t('actions.go-to-dashboard'),
      icon: 'dashboard',
      category: t('categories.navigation'),
      onUse: () => history.push('/dashboard')
    }, {
      id: 'go-to-downloads',
      name: t('actions.go-to-downloads'),
      icon: 'download',
      category: t('categories.navigation'),
      onUse: () => history.push('/downloads')
    }, {
      id: 'go-to-lyrics',
      name: t('actions.go-to-lyrics'),
      icon: 'microphone',
      category: t('categories.navigation'),
      onUse: () => history.push('/lyrics')
    }, {
      id: 'go-to-plugins',
      name: t('actions.go-to-plugins'),
      icon: 'flask',
      category: t('categories.navigation'),
      onUse: () => history.push('/plugins')
    }, {
      id: 'go-to-search',
      name: t('actions.go-to-search'),
      icon: 'search',
      category: t('categories.navigation'),
      onUse: () => history.push('/search')
    }, {
      id: 'go-to-settings',
      name: t('actions.go-to-settings'),
      icon: 'cog',
      category: t('categories.navigation'),
      onUse: () => history.push('/settings')
    }, {
      id: 'go-to-equalizer',
      name: t('actions.go-to-equalizer'),
      icon: 'align right',
      category: t('categories.navigation'),
      onUse: () => history.push('/equalizer')
    }, {
      id: 'go-to-visualizer',
      name: t('actions.go-to-visualizer'),
      icon: 'tint',
      category: t('categories.navigation'),
      onUse: () => history.push('/visualizer')
    }, {
      id: 'go-to-playlists',
      name: t('actions.go-to-playlists'),
      icon: 'list alternate outline',
      category: t('categories.navigation'),
      onUse: () => history.push('/playlists')
    }, {
      id: 'go-to-favorite-tracks',
      name: t('actions.go-to-favorite-tracks'),
      icon: 'music',
      category: t('categories.navigation'),
      onUse: () => history.push('/favorites/tracks')
    }, {
      id: 'go-to-library',
      name: t('actions.go-to-library'),
      icon: 'file audio outline',
      category: t('categories.navigation'),
      onUse: () => history.push('/library')
    }];
  };

  return useMemo(() => actions() as CommandPaletteAction[], [dispatch, playerActions, volume]);
};

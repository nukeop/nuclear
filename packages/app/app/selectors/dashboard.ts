import get from 'lodash/get';
import { RootState } from '../reducers';
import { editorialPlaylistKeyCreator } from '../reducers/dashboard';

export const dashboardSelector = (s: RootState) => s.dashboard;

export const editorialPlaylistSelector = (id: number) => (s: RootState) => s.dashboard.editorialCharts.data?.playlists.data.find(p => p.id === id);

export const playlistTracksSelector = (id: number) => (s: RootState) => get(s.dashboard, editorialPlaylistKeyCreator({id})) as RootState['dashboard']['editorialPlaylists'][number];

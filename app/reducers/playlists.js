import {
	ADD_PLAYLIST,
	LOAD_PLAYLISTS
} from '../actions/playlists';

const initialState = {
	playlists: []
};

export default function PlaylistsReducer(state=initialState, action) {
	switch(action.type) {
		case LOAD_PLAYLISTS:
		case ADD_PLAYLIST:
			return Object.assign({}, state, {
				playlists: action.payload
			});
		default:
			return state;
	}
}
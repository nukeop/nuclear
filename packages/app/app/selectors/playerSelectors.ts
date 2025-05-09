import { RootStateRTK } from '../store/storeTypes';
import { PlayerState } from '../slices/playerSlice';

export const selectPlaybackStatusRTK = (state: RootStateRTK): PlayerState['playbackStatus'] => state.player.playbackStatus;
export const selectPlaybackStreamLoadingRTK = (state: RootStateRTK): PlayerState['playbackStreamLoading'] => state.player.playbackStreamLoading;
export const selectPlaybackProgressRTK = (state: RootStateRTK): PlayerState['playbackProgress'] => state.player.playbackProgress;
export const selectSeekRTK = (state: RootStateRTK): PlayerState['seek'] => state.player.seek;
export const selectVolumeRTK = (state: RootStateRTK): PlayerState['volume'] => state.player.volume;
export const selectMutedRTK = (state: RootStateRTK): PlayerState['muted'] => state.player.muted;
export const selectPlaybackRateRTK = (state: RootStateRTK): PlayerState['playbackRate'] => state.player.playbackRate;

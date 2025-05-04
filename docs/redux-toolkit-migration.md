# Redux Toolkit Migration Plan

## Migration Phases

### Phase 1: Setup and Foundation

- [x] Install Redux Toolkit and required dependencies

  ```fish
  npm install @reduxjs/toolkit
  ```

- [x] Create a parallel store configuration using RTK's `configureStore`

  - [x] Create a new file at `/packages/app/app/store/configureStoreRTK.ts`
  - [x] Setup initial configuration that maintains compatibility with existing middleware
  - [x] Ensure DevTools integration works

- [ ] Update test utilities to support both the existing store and the new RTK store
  - [ ] Modify `/packages/app/test/testUtils.tsx` to support RTK store
  - [ ] Create new test utility functions as needed

### Phase 2: Slice-by-Slice Migration

For each reducer, we'll follow these steps:

#### Player Slice (First Target)

- [ ] Create a new RTK slice file `/packages/app/app/slices/playerSlice.ts`
- [ ] Convert existing reducer, actions, and types to RTK slice format
- [ ] Create RTK-based selectors
- [ ] Update component imports as needed
- [ ] Add migration tests
- [ ] Verify all functionality through existing integration tests

#### Queue Slice (Second Target)

- [ ] Create a new RTK slice file `/packages/app/app/slices/queueSlice.ts`
- [ ] Convert existing reducer, actions, and types to RTK slice format
- [ ] Create RTK-based selectors
- [ ] Update component imports as needed
- [ ] Add migration tests
- [ ] Verify all functionality through existing integration tests

#### Remaining Slices (in Priority Order)

- [ ] Playlists
- [ ] Settings
- [ ] Local
- [ ] Downloads
- [ ] Favorites
- [ ] Search
- [ ] Connectivity
- [ ] Dashboard
- [ ] Equalizer
- [ ] Lyrics
- [ ] Plugins
- [ ] Scrobbling
- [ ] Mastodon
- [ ] Toasts
- [ ] GithubContrib
- [ ] ImportFavs
- [ ] Tag
- [ ] Nuclear

### Phase 3: Store Transition

- [ ] Create a new root reducer that uses all the RTK slices
- [ ] Update the main store configuration to use the RTK-based root reducer
- [ ] Run all integration tests to verify functionality
- [ ] Update any remaining references to the old store

### Phase 4: Middleware and Enhancers Migration

- [ ] Convert IPC middleware to RTK-compatible middleware

  - [ ] Create a new middleware file at `/packages/app/app/store/middlewares/ipcRTK.ts`
  - [ ] Ensure compatibility with RTK's middleware API

- [ ] Migrate storage sync enhancer to RTK-compatible solution
  - [ ] Investigate using RTK's `createListenerMiddleware` or custom middleware
  - [ ] Update `/packages/app/app/store/enhancers/syncStorage.js` to be compatible with RTK

### Phase 5: Cleanup and Optimization

- [ ] Remove deprecated files and code

  - [ ] Original action creators
  - [ ] Original action type definitions
  - [ ] Original reducers
  - [ ] Original store configuration

- [ ] Optimize RTK implementation

  - [ ] Refine selector memoization
  - [ ] Optimize state structure if needed
  - [ ] Reduce bundle size

- [ ] Update documentation
  - [ ] Add comments to RTK slices
  - [ ] Update CONTRIBUTING.md with RTK patterns
  - [ ] Create examples for common state management tasks

## Implementation Reference

### Example: Converting a Reducer to an RTK Slice

Here's what the conversion will look like (using the player reducer as an example):

#### Current Player Reducer:

```typescript
// Current implementation in reducers/player.ts
import { getOption } from "@nuclear/core";
import Sound from "react-hifi";
import { ActionType, getType } from "typesafe-actions";
import * as PlayerActions from "../actions/player";
// ...imports

export type PlaybackStatus = "PAUSED" | "PLAYING" | "STOPPED";

type PlayerReducerState = {
  playbackStatus: PlaybackStatus;
  playbackStreamLoading: boolean;
  playbackProgress: number;
  seek: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
};

const initialState: () => PlayerReducerState = () => {
  return {
    playbackStatus: Sound.status.PAUSED,
    playbackStreamLoading: false,
    playbackProgress: 0,
    seek: 0,
    volume: getOption("volume") as number,
    muted: false,
    playbackRate: 2,
  };
};

// ...reducer implementation
```

#### RTK Slice (Target Implementation):

```typescript
// New implementation in slices/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOption } from "@nuclear/core";
import Sound from "react-hifi";

export type PlaybackStatus = "PAUSED" | "PLAYING" | "STOPPED";

interface PlayerState {
  playbackStatus: PlaybackStatus;
  playbackStreamLoading: boolean;
  playbackProgress: number;
  seek: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

const initialState: PlayerState = {
  playbackStatus: Sound.status.PAUSED,
  playbackStreamLoading: false,
  playbackProgress: 0,
  seek: 0,
  volume: getOption("volume") as number,
  muted: false,
  playbackRate: 2,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    startPlayback: (state, action: PayloadAction<boolean>) => {
      state.playbackStatus = Sound.status.PLAYING;
    },
    pausePlayback: (state, action: PayloadAction<boolean>) => {
      state.playbackStatus = Sound.status.PAUSED;
    },
    // ...other reducers
  },
});

export const {
  startPlayback,
  pausePlayback,
  // ...other actions
} = playerSlice.actions;

export default playerSlice.reducer;
```

### Example: Updating the Store Configuration

```typescript
// New configureStoreRTK.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import playerReducer from "../slices/playerSlice";
// ...other reducers

export const store = configureStore({
  reducer: {
    player: playerReducer,
    // ...other reducers will be added as they're converted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* custom middleware */),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

Track progress by checking off completed tasks and adding notes about any challenges encountered.

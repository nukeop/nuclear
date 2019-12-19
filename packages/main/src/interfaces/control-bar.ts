import { PlaybackStatus } from "@nuclear/common";

export interface ControlBarState {
  status: PlaybackStatus;
  canNext: true;
  canPrevious: true;
  volume?: number;
  seek?: number;
}

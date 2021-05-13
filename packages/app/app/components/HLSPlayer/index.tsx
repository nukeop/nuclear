import React, {RefObject, ReactElement} from 'react';
import ReactHlsPlayer from 'react-hls-player';

enum SoundStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

export enum SoundErrors {
  MEDIA_ERR_ABORTED = 'Video playback aborted by the user.',
  MEDIA_ERR_NETWORK = 'A network error caused the audio download to fail.',
  MEDIA_ERR_DECODE = 'The audio playback was aborted due to a corruption problem.',
  MEDIA_ERR_SRC_NOT_SUPPORTED = 'The audio playback can not be loaded, either because the server or network failed or because the format is not supported.',
  UNKNOWN = 'An unknown error occurred during audio playback loading.',
}

export interface SoundProps {
  /** the url of the stream to play */
  source: string;
  /** PLAYING, PAUSED or STOPPED */
  playStatus?: SoundStatus;
  /** the position in second */
  position?: number;
  /** the default setting of the audio contained */
  muted?: boolean;
  /** the audio volume */
  volume?: number;
  /** onTimeUpdate handler */
  onFinishedPlaying?: (event: any) => void;
  /** trigger when the load start */
  onLoading?: (event: any) => void;
  /** trigger when the file is ready to play */
  onLoad?: (event: any) => void;
  /** trigger when an error is thrown */
  onError?: (error: Error) => void;
  children?: ReactElement[] | ReactElement;
}

export interface SoundState {
  audioContext: AudioContext;
  audioNodes: AudioNode[];
}

class HlsPlayer extends React.Component<SoundProps, SoundState>  {
  playerRef: RefObject<HTMLVideoElement>;
  public state: SoundState = {
    audioContext: new AudioContext(),
    audioNodes: []
  };
  public static status = SoundStatus;
  constructor(props) {
    super(props);
    this.playerRef = React.createRef();
  }

  playVideo = () => {
    this.playerRef.current.play();
  }

  pauseVideo = () => {
    this.playerRef.current.pause();
  }

  toggleControls = () => {
    this.playerRef.current.controls = !this.playerRef.current.controls;
  }

  setAudioMuted = (muted: boolean) => {
    this.playerRef.current.muted = muted;
  }

  setAudioVolume = (volume: number) => {
    this.playerRef.current.volume = volume/100;
  }

  private setPlayerState(status?: SoundStatus): void {
    switch (status) {
    case HlsPlayer.status.PAUSED:
      this.pauseVideo();
      break;
    case HlsPlayer.status.STOPPED:
      this.pauseVideo();
      break;
    case HlsPlayer.status.PLAYING:
    default:
      this.playVideo();
      break;
    }
  }

  componentDidUpdate(prevProps: SoundProps) {
    const { playStatus, source, muted, volume } = this.props;

    if ((playStatus && prevProps.playStatus !== playStatus) || source !== prevProps.source) {
      this.setPlayerState(playStatus);
    }

    if (muted !== undefined && prevProps.muted !== muted) {
      this.setAudioMuted(muted);
    }

    if (volume && prevProps.volume !== volume) {
      this.setAudioVolume(volume);
    }
  }

  componentDidMount() {
    // function fireOnVideoStart() {
    //   // Do some stuff when the video starts/resumes playing
    // }
    // this.playerRef.current.addEventListener('play', fireOnVideoStart);

    if (this.props.onFinishedPlaying) {
      this.playerRef.current.addEventListener('ended', this.props.onFinishedPlaying);
    }
  }

  componentWillUnmount() {
    if (this.state.audioContext) {
      this.state.audioContext.close();
    }
  }

  componentDidCatch(err: Error) {
    if (this.state.audioContext) {
      this.state.audioContext.close();
    }
    this.props.onError && this.props.onError(err);
  }

  private handleError(evt: any) {
    let error: Error;
    switch (evt.target.error.code) {
    case evt.target.error.MEDIA_ERR_ABORTED:
      error = new Error(SoundErrors.MEDIA_ERR_ABORTED);
      break;
    case evt.target.error.MEDIA_ERR_NETWORK:
      error = new Error(SoundErrors.MEDIA_ERR_NETWORK);
      break;
    case evt.target.error.MEDIA_ERR_DECODE:
      error = new Error(SoundErrors.MEDIA_ERR_DECODE);
      break;
    case evt.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      error = new Error(SoundErrors.MEDIA_ERR_SRC_NOT_SUPPORTED);
      break;
    default:
      error = new Error(SoundErrors.UNKNOWN);
      break;
    }
    this.props.onError && this.props.onError(error);
  }

  render() {
    const {
      source
    } = this.props;

    return (
      <ReactHlsPlayer
        autoPlay
        height={0}
        width={0}
        style={{ display: 'none' }}
        playerRef={this.playerRef}
        src={source}
        onError={this.handleError}
      />
    );
  }
}

export default HlsPlayer;

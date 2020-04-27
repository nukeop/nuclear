enum IpcEvents {
  STARTED = 'started',

  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
  PLAYPAUSE = 'playpause',
  NEXT = 'next',
  PREVIOUS = 'previous',
  VOLUME = 'volume',
  MUTE = 'mute',
  SEEK = 'seek',
  PLAYING_STATUS = 'playing-status',
  SONG_CHANGE = 'song-change',

  LOCALFOLDER_REMOVE = 'remove-localfolder',
  LOCALFOLDERS_REFRESH = 'refresh-localfolders',
  LOCALFOLDERS_GET = 'get-localfolders',
  LOCALFOLDERS_SET = 'set-localfolders',
  LOCAL_METAS = 'get-metas',

  TRACK_ADD = 'add-track',
  TRACK_REMOVE = 'remove-track',
  TRACK_SELECT = 'select-track',
  QUEUE_CLEAR = 'clear-queue',
  QUEUE = 'queue',
  QUEUE_ADD = 'queue-add',
  QUEUE_DROP = 'queue_drop',

  SETTINGS = 'settings',
  SHUFFLE = 'shuffle',
  LOOP = 'loop',

  CONNECTIVITY = 'connectivity',

  DOWNLOAD_START = 'start-download',
  DOWNLOAD_PAUSE = 'pause-download',
  DOWNLOAD_STARTED = 'download-started',
  DOWNLOAD_PROGRESS = 'download-progress',
  DOWNLOAD_FINISHED = 'download-finished',
  DOWNLOAD_ERROR = 'download-error',


  WINDOW_MINIMIZE = 'minimize',
  WINDOW_MAXIMIZE = 'maximize',
  WINDOW_CLOSE = 'close',
  WINDOW_OPEN_DEVTOOLS = 'open-devtools',

  API_RESTART = 'restart-api',
  API_STOP = 'stop-api',

  PLAYLIST_CREATE = 'create-playlist',
  PLAYLIST_REFRESH = 'refresh-playlist',
  PLAYLIST_ACTIVATE = 'activate-playlist',
  PLAYLIST_ADD_QUEUE = 'add-queue-playlist',

  EQUALIZER_UPDATE = 'update-equalizer',
  EQUALIZER_SET = 'set-equalizer',

  LOCAL_FILES = 'local-files',
  LOCAL_FILES_PROGRESS = 'local-files-progress',
  LOCAL_FILES_ERROR = 'local-files-error',

  PLAY_STARTUP_TRACK = 'play-startup-track',

  ELECTRON_TIMBER_ERROR_EVENT = '__ELECTRON_TIMBER_ERROR__'
}

export default IpcEvents;

enum IpcEvents {
  // Application lifecycle events
  STARTED = 'started',

  // Playback control events
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

  // Local folder management events
  LOCALFOLDER_REMOVE = 'remove-localfolder',
  LOCALFOLDERS_REFRESH = 'refresh-localfolders',
  LOCALFOLDERS_GET = 'get-localfolders',
  LOCALFOLDERS_SET = 'set-localfolders',
  LOCAL_METAS = 'get-metas',

  // Listening history events
  POST_LISTENING_HISTORY_ENTRY = 'post-listening-history-entry',
  FETCH_LISTENING_HISTORY = 'fetch-listening-history',
  CLEAR_LISTENING_HISTORY = 'clear-listening-history',

  // Queue management events
  TRACK_ADD = 'add-track',
  TRACK_REMOVE = 'remove-track',
  TRACK_SELECT = 'select-track',
  QUEUE_CLEAR = 'clear-queue',
  QUEUE = 'queue',
  QUEUE_ADD = 'queue-add',
  QUEUE_DROP = 'queue_drop',

  // Application settings events
  SETTINGS = 'settings',
  SHUFFLE = 'shuffle',
  LOOP = 'loop',

  // Network connectivity events
  CONNECTIVITY = 'connectivity',

  // Download management events
  DOWNLOAD_GET_PATH = 'get-download-path',
  DOWNLOAD_START = 'start-download',
  DOWNLOAD_PAUSE = 'pause-download',
  DOWNLOAD_STARTED = 'download-started',
  DOWNLOAD_PROGRESS = 'download-progress',
  DOWNLOAD_FINISHED = 'download-finished',
  DOWNLOAD_ERROR = 'download-error',
  DOWNLOAD_REMOVED = 'download-removed',

  // Window management events
  WINDOW_MINIMIZE = 'minimize',
  WINDOW_MAXIMIZE = 'maximize',
  WINDOW_MINIFY = 'minify',
  WINDOW_RESTORE = 'restore',
  WINDOW_CLOSE = 'close',
  WINDOW_OPEN_DEVTOOLS = 'open-devtools',

  // API control events
  API_RESTART = 'restart-api',
  API_STOP = 'stop-api',

  // Playlist management events
  PLAYLIST_CREATE = 'create-playlist',
  PLAYLIST_REFRESH = 'refresh-playlist',
  PLAYLIST_ACTIVATE = 'activate-playlist',
  PLAYLIST_ADD_QUEUE = 'add-queue-playlist',

  // Spotify import events
  IMPORT_SPOTIFY_PLAYLIST_METADATA = 'import-spotify-playlist-metadata',
  IMPORT_SPOTIFY_PLAYLIST_PROGRESS = 'import-spotify-playlist-progress',
  IMPORT_SPOTIFY_PLAYLIST_SUCCESS = 'import-spotify-playlist-success',

  // Equalizer events
  EQUALIZER_UPDATE = 'update-equalizer',
  EQUALIZER_SET = 'set-equalizer',

  // Local file management events
  LOCAL_FILES = 'local-files',
  LOCAL_FILES_PROGRESS = 'local-files-progress',
  LOCAL_FILES_ERROR = 'local-files-error',

  // Startup events
  PLAY_STARTUP_TRACK = 'play-startup-track',

  // Logging events
  ELECTRON_NUCLEAR_LOGGER_ERROR_EVENT = '__ELECTRON_NUCLEAR_LOGGER_ERROR__',

  // Navigation events
  NAVIGATE_BACK = 'navigate-back',
  NAVIGATE_FORWARD = 'navigate-forward',

  // Electron utility events for system interaction
  OPEN_PATH_PICKER = 'open-path-picker',
  OPEN_FILE_PICKER = 'open-file-picker',
  OPEN_EXTERNAL_URL = 'open-external-url',
  SHOW_ITEM_IN_FOLDER = 'show-item-in-folder',
  COPY_TO_CLIPBOARD = 'copy-to-clipboard',
  GET_SYSTEM_INFO = 'get-system-info',
  SHOW_SAVE_DIALOG = 'show-save-dialog',  
}

export default IpcEvents;

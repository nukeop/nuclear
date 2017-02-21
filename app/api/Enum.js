var SidebarMenuItemEnum = {
  DEFAULT: 0,
  QUEUE: 1,
  DOWNLOADS: 2
}

var MainContentItemEnum = {
  SEARCH: 0,
  PLAYLISTS: 1,
  SETTINGS: 2,
  ALBUMS: 3
}

var DownloadQueueStatusEnum = {
  QUEUED: 0,
  INPROGRESS: 1,
  FINISHED: 2,
  ERROR: 3
}

module.exports = {
  SidebarMenuItemEnum: SidebarMenuItemEnum,
  MainContentItemEnum: MainContentItemEnum,
  DownloadQueueStatusEnum: DownloadQueueStatusEnum
}

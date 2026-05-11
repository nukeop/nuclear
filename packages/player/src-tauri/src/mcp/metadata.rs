use serde_json::{json, Value};

pub fn list_methods(domain: &str) -> Result<Value, String> {
    let result = match domain {
        "Queue" => json!({
            "domain": "Queue",
            "description": "Manage the playback queue — add, remove, reorder tracks and control navigation.",
            "methods": [
                "getQueue",
                "getCurrentItem",
                "addToQueue",
                "addNext",
                "addAt",
                "removeByIds",
                "removeByIndices",
                "clearQueue",
                "reorder",
                "goToNext",
                "goToPrevious",
                "goToIndex",
                "goToId",
                "updateItemState"
            ]
        }),
        "Playback" => json!({
            "domain": "Playback",
            "description": "Control audio playback state, transport, and seeking.",
            "methods": [
                "getState",
                "play",
                "pause",
                "stop",
                "toggle",
                "seekTo",
                "getVolume",
                "setVolume",
                "isMuted",
                "setMuted",
                "isShuffleEnabled",
                "setShuffleEnabled",
                "getRepeatMode",
                "setRepeatMode"
            ]
        }),
        "Metadata" => json!({
            "domain": "Metadata",
            "description": "Search for music and fetch artist, album, and track metadata.",
            "methods": [
                "search",
                "fetchArtistBio",
                "fetchArtistSocialStats",
                "fetchArtistAlbums",
                "fetchArtistTopTracks",
                "fetchArtistPlaylists",
                "fetchArtistRelatedArtists",
                "fetchAlbumDetails"
            ]
        }),
        "Favorites" => json!({
            "domain": "Favorites",
            "description": "Manage favorite tracks, albums, and artists.",
            "methods": [
                "getTracks",
                "getAlbums",
                "getArtists",
                "addTrack",
                "removeTrack",
                "isTrackFavorite",
                "addAlbum",
                "removeAlbum",
                "isAlbumFavorite",
                "addArtist",
                "removeArtist",
                "isArtistFavorite"
            ]
        }),
        "Playlists" => json!({
            "domain": "Playlists",
            "description": "Create, edit, import, and manage playlists.",
            "methods": [
                "getIndex",
                "getPlaylist",
                "createPlaylist",
                "deletePlaylist",
                "addTracks",
                "removeTracks",
                "reorderTracks",
                "importPlaylist",
                "saveQueueAsPlaylist"
            ]
        }),
        "Dashboard" => json!({
            "domain": "Dashboard",
            "description": "Fetch trending and editorial content from music providers.",
            "methods": [
                "fetchTopTracks",
                "fetchTopArtists",
                "fetchTopAlbums",
                "fetchEditorialPlaylists",
                "fetchNewReleases"
            ]
        }),
        "Providers" => json!({
            "domain": "Providers",
            "description": "Query registered music providers (metadata, streaming, dashboard, etc.).",
            "methods": [
                "list",
                "get"
            ]
        }),
        _ => {
            return Err(format!(
                "Unknown domain: '{domain}'. Available domains: Queue, Playback, Metadata, Favorites, Playlists, Dashboard, Providers."
            ))
        }
    };

    Ok(result)
}

pub fn method_details(domain: &str, method: &str) -> Result<Value, String> {
    let result = match (domain, method) {
        ("Queue", "getQueue") => json!({
            "domain": "Queue",
            "method": "getQueue",
            "description": "Get the current queue state.",
            "params": [],
            "returns": "Queue"
        }),
        ("Queue", "getCurrentItem") => json!({
            "domain": "Queue",
            "method": "getCurrentItem",
            "description": "Get the currently playing queue item.",
            "params": [],
            "returns": "QueueItem | undefined"
        }),
        ("Queue", "addToQueue") => json!({
            "domain": "Queue",
            "method": "addToQueue",
            "description": "Add tracks to the end of the queue.",
            "params": [{ "name": "tracks", "type": "Track[]" }],
            "returns": "void"
        }),
        ("Queue", "addNext") => json!({
            "domain": "Queue",
            "method": "addNext",
            "description": "Insert tracks immediately after the current item.",
            "params": [{ "name": "tracks", "type": "Track[]" }],
            "returns": "void"
        }),
        ("Queue", "addAt") => json!({
            "domain": "Queue",
            "method": "addAt",
            "description": "Insert tracks at a specific position.",
            "params": [
                { "name": "tracks", "type": "Track[]" },
                { "name": "index", "type": "number" }
            ],
            "returns": "void"
        }),
        ("Queue", "removeByIds") => json!({
            "domain": "Queue",
            "method": "removeByIds",
            "description": "Remove items from the queue by their IDs.",
            "params": [{ "name": "ids", "type": "string[]" }],
            "returns": "void"
        }),
        ("Queue", "removeByIndices") => json!({
            "domain": "Queue",
            "method": "removeByIndices",
            "description": "Remove items from the queue by their indices.",
            "params": [{ "name": "indices", "type": "number[]" }],
            "returns": "void"
        }),
        ("Queue", "clearQueue") => json!({
            "domain": "Queue",
            "method": "clearQueue",
            "description": "Remove all items from the queue.",
            "params": [],
            "returns": "void"
        }),
        ("Queue", "reorder") => json!({
            "domain": "Queue",
            "method": "reorder",
            "description": "Move a queue item from one position to another.",
            "params": [
                { "name": "fromIndex", "type": "number" },
                { "name": "toIndex", "type": "number" }
            ],
            "returns": "void"
        }),
        ("Queue", "goToNext") => json!({
            "domain": "Queue",
            "method": "goToNext",
            "description": "Skip to the next item.",
            "params": [],
            "returns": "void"
        }),
        ("Queue", "goToPrevious") => json!({
            "domain": "Queue",
            "method": "goToPrevious",
            "description": "Go back to the previous item.",
            "params": [],
            "returns": "void"
        }),
        ("Queue", "goToIndex") => json!({
            "domain": "Queue",
            "method": "goToIndex",
            "description": "Jump to a specific position in the queue.",
            "params": [{ "name": "index", "type": "number" }],
            "returns": "void"
        }),
        ("Queue", "goToId") => json!({
            "domain": "Queue",
            "method": "goToId",
            "description": "Jump to a specific queue item by its ID.",
            "params": [{ "name": "id", "type": "string" }],
            "returns": "void"
        }),
        ("Queue", "updateItemState") => json!({
            "domain": "Queue",
            "method": "updateItemState",
            "description": "Update the loading status of a queue item.",
            "params": [
                { "name": "id", "type": "string" },
                { "name": "updates", "type": "QueueItemStateUpdate" }
            ],
            "returns": "void"
        }),

        ("Playback", "getState") => json!({
            "domain": "Playback",
            "method": "getState",
            "description": "Get the current playback state (status, seek position, duration).",
            "params": [],
            "returns": "PlaybackState"
        }),
        ("Playback", "play") => json!({
            "domain": "Playback",
            "method": "play",
            "description": "Start or resume playback.",
            "params": [],
            "returns": "void"
        }),
        ("Playback", "pause") => json!({
            "domain": "Playback",
            "method": "pause",
            "description": "Pause playback.",
            "params": [],
            "returns": "void"
        }),
        ("Playback", "stop") => json!({
            "domain": "Playback",
            "method": "stop",
            "description": "Stop playback and reset position.",
            "params": [],
            "returns": "void"
        }),
        ("Playback", "toggle") => json!({
            "domain": "Playback",
            "method": "toggle",
            "description": "Toggle between play and pause.",
            "params": [],
            "returns": "void"
        }),
        ("Playback", "seekTo") => json!({
            "domain": "Playback",
            "method": "seekTo",
            "description": "Seek to a position in seconds.",
            "params": [{ "name": "seconds", "type": "number" }],
            "returns": "void"
        }),
        ("Playback", "getVolume") => json!({
            "domain": "Playback",
            "method": "getVolume",
            "description": "Get the current volume level (0 to 1).",
            "params": [],
            "returns": "number"
        }),
        ("Playback", "setVolume") => json!({
            "domain": "Playback",
            "method": "setVolume",
            "description": "Set the volume level (0 to 1, where 0 is silent and 1 is full volume).",
            "params": [{ "name": "volume", "type": "number" }],
            "returns": "void"
        }),
        ("Playback", "isMuted") => json!({
            "domain": "Playback",
            "method": "isMuted",
            "description": "Check whether audio output is muted.",
            "params": [],
            "returns": "boolean"
        }),
        ("Playback", "setMuted") => json!({
            "domain": "Playback",
            "method": "setMuted",
            "description": "Mute or unmute audio.",
            "params": [{ "name": "muted", "type": "boolean" }],
            "returns": "void"
        }),
        ("Playback", "isShuffleEnabled") => json!({
            "domain": "Playback",
            "method": "isShuffleEnabled",
            "description": "Check whether shuffle is enabled.",
            "params": [],
            "returns": "boolean"
        }),
        ("Playback", "setShuffleEnabled") => json!({
            "domain": "Playback",
            "method": "setShuffleEnabled",
            "description": "Enable or disable shuffle.",
            "params": [{ "name": "enabled", "type": "boolean" }],
            "returns": "void"
        }),
        ("Playback", "getRepeatMode") => json!({
            "domain": "Playback",
            "method": "getRepeatMode",
            "description": "Get the current repeat mode: \"off\" (no repeat), \"all\" (repeat entire queue), or \"one\" (repeat current track).",
            "params": [],
            "returns": "\"off\" | \"all\" | \"one\""
        }),
        ("Playback", "setRepeatMode") => json!({
            "domain": "Playback",
            "method": "setRepeatMode",
            "description": "Set the repeat mode: \"off\" (no repeat), \"all\" (repeat entire queue), or \"one\" (repeat current track).",
            "params": [{ "name": "mode", "type": "\"off\" | \"all\" | \"one\"" }],
            "returns": "void"
        }),

        ("Metadata", "search") => json!({
            "domain": "Metadata",
            "method": "search",
            "description": "Search for artists, albums, tracks, and playlists.",
            "params": [
                { "name": "params", "type": "SearchParams" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "SearchResults"
        }),
        ("Metadata", "fetchArtistBio") => json!({
            "domain": "Metadata",
            "method": "fetchArtistBio",
            "description": "Fetch an artist's biography and tags.",
            "params": [
                { "name": "artistId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "ArtistBio"
        }),
        ("Metadata", "fetchArtistSocialStats") => json!({
            "domain": "Metadata",
            "method": "fetchArtistSocialStats",
            "description": "Fetch an artist's social media stats (followers, track count, etc.).",
            "params": [
                { "name": "artistId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "ArtistSocialStats"
        }),
        ("Metadata", "fetchArtistAlbums") => json!({
            "domain": "Metadata",
            "method": "fetchArtistAlbums",
            "description": "Fetch an artist's album discography.",
            "params": [
                { "name": "artistId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "AlbumRef[]"
        }),
        ("Metadata", "fetchArtistTopTracks") => json!({
            "domain": "Metadata",
            "method": "fetchArtistTopTracks",
            "description": "Fetch an artist's most popular tracks.",
            "params": [
                { "name": "artistId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "TrackRef[]"
        }),
        ("Metadata", "fetchArtistPlaylists") => json!({
            "domain": "Metadata",
            "method": "fetchArtistPlaylists",
            "description": "Fetch playlists associated with an artist.",
            "params": [
                { "name": "artistId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "PlaylistRef[]"
        }),
        ("Metadata", "fetchArtistRelatedArtists") => json!({
            "domain": "Metadata",
            "method": "fetchArtistRelatedArtists",
            "description": "Fetch artists similar to the given artist.",
            "params": [
                { "name": "artistId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "ArtistRef[]"
        }),
        ("Metadata", "fetchAlbumDetails") => json!({
            "domain": "Metadata",
            "method": "fetchAlbumDetails",
            "description": "Fetch full album details including track listing.",
            "params": [
                { "name": "albumId", "type": "string" },
                { "name": "providerId", "type": "string?" }
            ],
            "returns": "Album"
        }),

        ("Favorites", "getTracks") => json!({
            "domain": "Favorites",
            "method": "getTracks",
            "description": "Get all favorite tracks.",
            "params": [],
            "returns": "FavoriteEntry<Track>[]"
        }),
        ("Favorites", "getAlbums") => json!({
            "domain": "Favorites",
            "method": "getAlbums",
            "description": "Get all favorite albums.",
            "params": [],
            "returns": "FavoriteEntry<AlbumRef>[]"
        }),
        ("Favorites", "getArtists") => json!({
            "domain": "Favorites",
            "method": "getArtists",
            "description": "Get all favorite artists.",
            "params": [],
            "returns": "FavoriteEntry<ArtistRef>[]"
        }),
        ("Favorites", "addTrack") => json!({
            "domain": "Favorites",
            "method": "addTrack",
            "description": "Add a track to favorites.",
            "params": [{ "name": "track", "type": "Track" }],
            "returns": "void"
        }),
        ("Favorites", "removeTrack") => json!({
            "domain": "Favorites",
            "method": "removeTrack",
            "description": "Remove a track from favorites by its provider reference.",
            "params": [{ "name": "source", "type": "ProviderRef" }],
            "returns": "void"
        }),
        ("Favorites", "isTrackFavorite") => json!({
            "domain": "Favorites",
            "method": "isTrackFavorite",
            "description": "Check if a track is in favorites.",
            "params": [{ "name": "source", "type": "ProviderRef" }],
            "returns": "boolean"
        }),
        ("Favorites", "addAlbum") => json!({
            "domain": "Favorites",
            "method": "addAlbum",
            "description": "Add an album to favorites.",
            "params": [{ "name": "ref", "type": "AlbumRef" }],
            "returns": "void"
        }),
        ("Favorites", "removeAlbum") => json!({
            "domain": "Favorites",
            "method": "removeAlbum",
            "description": "Remove an album from favorites by its provider reference.",
            "params": [{ "name": "source", "type": "ProviderRef" }],
            "returns": "void"
        }),
        ("Favorites", "isAlbumFavorite") => json!({
            "domain": "Favorites",
            "method": "isAlbumFavorite",
            "description": "Check if an album is in favorites.",
            "params": [{ "name": "source", "type": "ProviderRef" }],
            "returns": "boolean"
        }),
        ("Favorites", "addArtist") => json!({
            "domain": "Favorites",
            "method": "addArtist",
            "description": "Add an artist to favorites.",
            "params": [{ "name": "ref", "type": "ArtistRef" }],
            "returns": "void"
        }),
        ("Favorites", "removeArtist") => json!({
            "domain": "Favorites",
            "method": "removeArtist",
            "description": "Remove an artist from favorites by its provider reference.",
            "params": [{ "name": "source", "type": "ProviderRef" }],
            "returns": "void"
        }),
        ("Favorites", "isArtistFavorite") => json!({
            "domain": "Favorites",
            "method": "isArtistFavorite",
            "description": "Check if an artist is in favorites.",
            "params": [{ "name": "source", "type": "ProviderRef" }],
            "returns": "boolean"
        }),

        ("Playlists", "getIndex") => json!({
            "domain": "Playlists",
            "method": "getIndex",
            "description": "Get the list of all playlists with summary info.",
            "params": [],
            "returns": "PlaylistIndexEntry[]"
        }),
        ("Playlists", "getPlaylist") => json!({
            "domain": "Playlists",
            "method": "getPlaylist",
            "description": "Get a playlist by ID with all its items.",
            "params": [{ "name": "id", "type": "string" }],
            "returns": "Playlist | null"
        }),
        ("Playlists", "createPlaylist") => json!({
            "domain": "Playlists",
            "method": "createPlaylist",
            "description": "Create a new empty playlist. Returns the playlist ID.",
            "params": [{ "name": "name", "type": "string" }],
            "returns": "string"
        }),
        ("Playlists", "deletePlaylist") => json!({
            "domain": "Playlists",
            "method": "deletePlaylist",
            "description": "Delete a playlist by ID.",
            "params": [{ "name": "id", "type": "string" }],
            "returns": "void"
        }),
        ("Playlists", "addTracks") => json!({
            "domain": "Playlists",
            "method": "addTracks",
            "description": "Add tracks to a playlist. Returns the created playlist items.",
            "params": [
                { "name": "playlistId", "type": "string" },
                { "name": "tracks", "type": "Track[]" }
            ],
            "returns": "PlaylistItem[]"
        }),
        ("Playlists", "removeTracks") => json!({
            "domain": "Playlists",
            "method": "removeTracks",
            "description": "Remove items from a playlist by their item IDs.",
            "params": [
                { "name": "playlistId", "type": "string" },
                { "name": "itemIds", "type": "string[]" }
            ],
            "returns": "void"
        }),
        ("Playlists", "reorderTracks") => json!({
            "domain": "Playlists",
            "method": "reorderTracks",
            "description": "Move a track within a playlist from one position to another.",
            "params": [
                { "name": "playlistId", "type": "string" },
                { "name": "from", "type": "number" },
                { "name": "to", "type": "number" }
            ],
            "returns": "void"
        }),
        ("Playlists", "importPlaylist") => json!({
            "domain": "Playlists",
            "method": "importPlaylist",
            "description": "Import a full playlist object. Returns the new playlist ID.",
            "params": [{ "name": "playlist", "type": "Playlist" }],
            "returns": "string"
        }),
        ("Playlists", "saveQueueAsPlaylist") => json!({
            "domain": "Playlists",
            "method": "saveQueueAsPlaylist",
            "description": "Save the current queue as a new playlist. Returns the playlist ID.",
            "params": [{ "name": "name", "type": "string" }],
            "returns": "string"
        }),

        ("Dashboard", "fetchTopTracks") => json!({
            "domain": "Dashboard",
            "method": "fetchTopTracks",
            "description": "Fetch top/trending tracks, optionally from a specific provider.",
            "params": [{ "name": "providerId", "type": "string?" }],
            "returns": "AttributedResult<Track>[]"
        }),
        ("Dashboard", "fetchTopArtists") => json!({
            "domain": "Dashboard",
            "method": "fetchTopArtists",
            "description": "Fetch top/trending artists, optionally from a specific provider.",
            "params": [{ "name": "providerId", "type": "string?" }],
            "returns": "AttributedResult<ArtistRef>[]"
        }),
        ("Dashboard", "fetchTopAlbums") => json!({
            "domain": "Dashboard",
            "method": "fetchTopAlbums",
            "description": "Fetch top/trending albums, optionally from a specific provider.",
            "params": [{ "name": "providerId", "type": "string?" }],
            "returns": "AttributedResult<AlbumRef>[]"
        }),
        ("Dashboard", "fetchEditorialPlaylists") => json!({
            "domain": "Dashboard",
            "method": "fetchEditorialPlaylists",
            "description": "Fetch editorial/curated playlists, optionally from a specific provider.",
            "params": [{ "name": "providerId", "type": "string?" }],
            "returns": "AttributedResult<PlaylistRef>[]"
        }),
        ("Dashboard", "fetchNewReleases") => json!({
            "domain": "Dashboard",
            "method": "fetchNewReleases",
            "description": "Fetch new album releases, optionally from a specific provider.",
            "params": [{ "name": "providerId", "type": "string?" }],
            "returns": "AttributedResult<AlbumRef>[]"
        }),

        ("Providers", "list") => json!({
            "domain": "Providers",
            "method": "list",
            "description": "List all registered providers, optionally filtered by kind (metadata, streaming, lyrics, dashboard).",
            "params": [{ "name": "kind", "type": "string?" }],
            "returns": "ProviderDescriptor[]"
        }),
        ("Providers", "get") => json!({
            "domain": "Providers",
            "method": "get",
            "description": "Get a specific provider by ID and kind.",
            "params": [
                { "name": "id", "type": "string" },
                { "name": "kind", "type": "string" }
            ],
            "returns": "ProviderDescriptor | undefined"
        }),

        _ => {
            let domain_check = list_methods(domain);
            match domain_check {
                Ok(domain_info) => {
                    let available = domain_info["methods"]
                        .as_array()
                        .map(|methods| {
                            methods
                                .iter()
                                .filter_map(|method| method.as_str())
                                .collect::<Vec<_>>()
                                .join(", ")
                        })
                        .unwrap_or_default();
                    return Err(format!(
                        "Unknown method '{method}' in domain '{domain}'. Available methods: {available}."
                    ));
                }
                Err(_) => {
                    return Err(format!(
                        "Unknown domain: '{domain}'. Available domains: Queue, Playback, Metadata, Favorites, Playlists, Dashboard, Providers."
                    ));
                }
            }
        }
    };

    Ok(result)
}

pub fn describe_type(type_name: &str) -> Result<Value, String> {
    let result = match type_name {
        "ProviderRef" => json!({
            "type": "ProviderRef",
            "description": "A reference to an entity within a specific provider (e.g. a MusicBrainz artist, a YouTube video).",
            "fields": {
                "provider": { "type": "string", "description": "Provider identifier" },
                "id": { "type": "string", "description": "Entity ID within the provider" },
                "url": { "type": "string", "optional": true, "description": "URL to the entity on the provider" }
            }
        }),
        "ArtistCredit" => json!({
            "type": "ArtistCredit",
            "description": "A credited artist on a track or album, with roles.",
            "fields": {
                "name": { "type": "string" },
                "roles": { "type": "string[]", "description": "e.g. [\"performer\", \"composer\"]" },
                "source": { "type": "ProviderRef", "optional": true }
            }
        }),
        "Artwork" => json!({
            "type": "Artwork",
            "description": "A single image at a specific size and purpose.",
            "fields": {
                "url": { "type": "string" },
                "width": { "type": "number", "optional": true },
                "height": { "type": "number", "optional": true },
                "purpose": { "type": "\"avatar\" | \"cover\" | \"background\" | \"thumbnail\"", "optional": true },
                "source": { "type": "ProviderRef", "optional": true }
            }
        }),
        "ArtworkSet" => json!({
            "type": "ArtworkSet",
            "description": "A collection of artwork images at different sizes and purposes.",
            "fields": {
                "items": { "type": "Artwork[]" }
            }
        }),
        "ArtistRef" => json!({
            "type": "ArtistRef",
            "description": "A lightweight reference to an artist entity.",
            "fields": {
                "name": { "type": "string" },
                "disambiguation": { "type": "string", "optional": true },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "AlbumRef" => json!({
            "type": "AlbumRef",
            "description": "A lightweight reference to an album.",
            "fields": {
                "title": { "type": "string" },
                "artists": { "type": "ArtistRef[]", "optional": true },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "TrackRef" => json!({
            "type": "TrackRef",
            "description": "A lightweight reference to a track (used in album track listings).",
            "fields": {
                "title": { "type": "string" },
                "artists": { "type": "ArtistRef[]" },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "LocalFileInfo" => json!({
            "type": "LocalFileInfo",
            "description": "Metadata about a local audio file.",
            "fields": {
                "fileUri": { "type": "string" },
                "fileSize": { "type": "number", "optional": true },
                "format": { "type": "string", "optional": true },
                "bitrateKbps": { "type": "number", "optional": true },
                "sampleRateHz": { "type": "number", "optional": true },
                "channels": { "type": "number", "optional": true },
                "fingerprint": { "type": "string", "optional": true },
                "scannedAtIso": { "type": "string", "optional": true }
            }
        }),
        "Stream" => json!({
            "type": "Stream",
            "description": "A resolved audio stream URL with quality metadata.",
            "fields": {
                "url": { "type": "string" },
                "protocol": { "type": "\"file\" | \"http\" | \"https\" | \"hls\"" },
                "mimeType": { "type": "string", "optional": true },
                "bitrateKbps": { "type": "number", "optional": true },
                "codec": { "type": "string", "optional": true },
                "container": { "type": "string", "optional": true },
                "qualityLabel": { "type": "string", "optional": true },
                "durationMs": { "type": "number", "optional": true },
                "contentLengthBytes": { "type": "number", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "StreamCandidate" => json!({
            "type": "StreamCandidate",
            "description": "A potential stream source for a track, possibly with a resolved stream.",
            "fields": {
                "id": { "type": "string" },
                "title": { "type": "string" },
                "durationMs": { "type": "number", "optional": true },
                "thumbnail": { "type": "string", "optional": true },
                "stream": { "type": "Stream", "optional": true },
                "lastResolvedAtIso": { "type": "string", "optional": true },
                "failed": { "type": "boolean" },
                "source": { "type": "ProviderRef" }
            }
        }),
        "Track" => json!({
            "type": "Track",
            "description": "A full track with metadata, artwork, and optional streaming info.",
            "fields": {
                "title": { "type": "string" },
                "artists": { "type": "ArtistCredit[]" },
                "album": { "type": "AlbumRef", "optional": true },
                "durationMs": { "type": "number", "optional": true },
                "trackNumber": { "type": "number", "optional": true },
                "disc": { "type": "string", "optional": true },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "tags": { "type": "string[]", "optional": true },
                "source": { "type": "ProviderRef" },
                "localFile": { "type": "LocalFileInfo", "optional": true },
                "streamCandidates": { "type": "StreamCandidate[]", "optional": true }
            }
        }),
        "QueueItem" => json!({
            "type": "QueueItem",
            "description": "A track in the playback queue with its loading status.",
            "fields": {
                "id": { "type": "string" },
                "track": { "type": "Track" },
                "status": { "type": "\"idle\" | \"loading\" | \"success\" | \"error\"" },
                "error": { "type": "string", "optional": true },
                "addedAtIso": { "type": "string" }
            }
        }),
        "Queue" => json!({
            "type": "Queue",
            "description": "The playback queue state.",
            "fields": {
                "items": { "type": "QueueItem[]" },
                "currentIndex": { "type": "number" }
            }
        }),
        "PlaylistRef" => json!({
            "type": "PlaylistRef",
            "description": "A lightweight reference to a playlist.",
            "fields": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "PlaylistItem" => json!({
            "type": "PlaylistItem",
            "description": "A track within a playlist.",
            "fields": {
                "id": { "type": "string" },
                "track": { "type": "Track" },
                "note": { "type": "string", "optional": true },
                "addedAtIso": { "type": "string" }
            }
        }),
        "Playlist" => json!({
            "type": "Playlist",
            "description": "A full playlist with metadata and items.",
            "fields": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "description": { "type": "string", "optional": true },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "tags": { "type": "string[]", "optional": true },
                "createdAtIso": { "type": "string" },
                "lastModifiedIso": { "type": "string" },
                "origin": { "type": "ProviderRef", "optional": true },
                "isReadOnly": { "type": "boolean" },
                "parentId": { "type": "string", "optional": true },
                "items": { "type": "PlaylistItem[]" }
            }
        }),
        "PlaylistIndexEntry" => json!({
            "type": "PlaylistIndexEntry",
            "description": "Summary info for a playlist in the index.",
            "fields": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "createdAtIso": { "type": "string" },
                "lastModifiedIso": { "type": "string" },
                "isReadOnly": { "type": "boolean" },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "itemCount": { "type": "number" },
                "totalDurationMs": { "type": "number" }
            }
        }),
        "SearchParams" => json!({
            "type": "SearchParams",
            "description": "Parameters for a music search query.",
            "fields": {
                "query": { "type": "string" },
                "types": { "type": "\"artists\" | \"albums\" | \"tracks\" | \"playlists\"[]", "optional": true, "description": "Categories to search" },
                "limit": { "type": "number", "optional": true }
            }
        }),
        "SearchResults" => json!({
            "type": "SearchResults",
            "description": "Results from a music search, grouped by category.",
            "fields": {
                "artists": { "type": "ArtistRef[]", "optional": true },
                "albums": { "type": "AlbumRef[]", "optional": true },
                "tracks": { "type": "Track[]", "optional": true },
                "playlists": { "type": "PlaylistRef[]", "optional": true }
            }
        }),
        "Album" => json!({
            "type": "Album",
            "description": "A full album with track listing and metadata.",
            "fields": {
                "title": { "type": "string" },
                "artists": { "type": "ArtistCredit[]" },
                "tracks": { "type": "TrackRef[]", "optional": true },
                "releaseDate": { "type": "ReleaseDate", "optional": true, "description": "Release date with precision" },
                "genres": { "type": "string[]", "optional": true },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "ReleaseDate" => json!({
            "type": "ReleaseDate",
            "description": "A date with precision indicator.",
            "fields": {
                "precision": { "type": "\"year\" | \"month\" | \"day\"" },
                "dateIso": { "type": "string" }
            }
        }),
        "ArtistBio" => json!({
            "type": "ArtistBio",
            "description": "An artist's biography, tags, and tour status.",
            "fields": {
                "name": { "type": "string" },
                "disambiguation": { "type": "string", "optional": true },
                "bio": { "type": "string", "optional": true },
                "onTour": { "type": "boolean", "optional": true },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "tags": { "type": "string[]", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "ArtistSocialStats" => json!({
            "type": "ArtistSocialStats",
            "description": "An artist's social media and platform statistics.",
            "fields": {
                "name": { "type": "string" },
                "artwork": { "type": "ArtworkSet", "optional": true },
                "city": { "type": "string", "optional": true },
                "country": { "type": "string", "optional": true },
                "followersCount": { "type": "number", "optional": true },
                "followingsCount": { "type": "number", "optional": true },
                "trackCount": { "type": "number", "optional": true },
                "playlistCount": { "type": "number", "optional": true },
                "source": { "type": "ProviderRef" }
            }
        }),
        "PlaybackState" => json!({
            "type": "PlaybackState",
            "description": "Current audio playback state.",
            "fields": {
                "status": { "type": "\"playing\" | \"paused\" | \"stopped\"" },
                "seek": { "type": "number", "description": "Current position in seconds" },
                "duration": { "type": "number", "description": "Total duration in seconds" }
            }
        }),
        "FavoriteEntry" => json!({
            "type": "FavoriteEntry",
            "description": "A favorited item with timestamp. The ref field contains the actual entity (Track, AlbumRef, or ArtistRef).",
            "fields": {
                "ref": { "type": "Track | AlbumRef | ArtistRef", "description": "The favorited entity" },
                "addedAtIso": { "type": "string" }
            }
        }),
        "AttributedResult" => json!({
            "type": "AttributedResult",
            "description": "A batch of results from a specific provider.",
            "fields": {
                "providerId": { "type": "string" },
                "metadataProviderId": { "type": "string", "optional": true },
                "providerName": { "type": "string" },
                "items": { "type": "any[]", "description": "Array of result items (Track, ArtistRef, AlbumRef, or PlaylistRef depending on the endpoint)" }
            }
        }),
        "StreamResolutionResult" => json!({
            "type": "StreamResolutionResult",
            "description": "Result of resolving stream candidates for a track. Either succeeds with candidates or fails with an error.",
            "fields": {
                "success": { "type": "boolean" },
                "candidates": { "type": "StreamCandidate[]", "optional": true, "description": "Present when success is true" },
                "error": { "type": "string", "optional": true, "description": "Present when success is false" }
            }
        }),
        "ProviderDescriptor" => json!({
            "type": "ProviderDescriptor",
            "description": "Describes a registered provider (metadata, streaming, dashboard, etc.).",
            "fields": {
                "id": { "type": "string" },
                "kind": { "type": "string", "description": "Provider kind: metadata, streaming, lyrics, dashboard, etc." },
                "name": { "type": "string" },
                "pluginId": { "type": "string", "optional": true }
            }
        }),
        "YtdlpSearchResult" => json!({
            "type": "YtdlpSearchResult",
            "description": "A YouTube search result from yt-dlp.",
            "fields": {
                "id": { "type": "string", "description": "YouTube video ID" },
                "title": { "type": "string" },
                "duration": { "type": "number | null" },
                "thumbnail": { "type": "string | null" }
            }
        }),
        "YtdlpStreamInfo" => json!({
            "type": "YtdlpStreamInfo",
            "description": "A resolved YouTube audio stream from yt-dlp.",
            "fields": {
                "stream_url": { "type": "string" },
                "duration": { "type": "number | null" },
                "title": { "type": "string | null" },
                "container": { "type": "string | null" },
                "codec": { "type": "string | null" }
            }
        }),
        "QueueItemStateUpdate" => json!({
            "type": "QueueItemStateUpdate",
            "description": "Partial update for a queue item status.",
            "fields": {
                "status": { "type": "\"idle\" | \"loading\" | \"success\" | \"error\"", "optional": true },
                "error": { "type": "string", "optional": true }
            }
        }),
        _ => {
            return Err(format!(
                "Unknown type: '{type_name}'. Available types: ProviderRef, ArtistCredit, Artwork, ArtworkSet, ArtistRef, AlbumRef, TrackRef, LocalFileInfo, Stream, StreamCandidate, Track, QueueItem, Queue, PlaylistRef, PlaylistItem, Playlist, PlaylistIndexEntry, SearchParams, SearchResults, Album, ReleaseDate, ArtistBio, ArtistSocialStats, PlaybackState, FavoriteEntry, AttributedResult, StreamResolutionResult, ProviderDescriptor, YtdlpSearchResult, YtdlpStreamInfo, QueueItemStateUpdate."
            ))
        }
    };

    Ok(result)
}

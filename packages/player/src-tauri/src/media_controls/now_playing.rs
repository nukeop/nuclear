use std::time::Duration;

use serde::Deserialize;
use souvlaki::{MediaMetadata, MediaPlayback, MediaPosition};

#[derive(Deserialize)]
pub struct QueueItem {
    pub id: String,
    pub track: Track,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Track {
    title: String,
    artists: Vec<Named>,
    album: Option<Album>,
    duration_ms: Option<f64>,
    artwork: Option<ArtworkSet>,
}

#[derive(Deserialize)]
struct Named {
    name: String,
}

#[derive(Deserialize)]
struct Album {
    title: String,
}

#[derive(Deserialize)]
struct ArtworkSet {
    items: Vec<Artwork>,
}

#[derive(Deserialize)]
struct Artwork {
    url: Option<String>,
}

impl Track {
    pub fn cover_url(self) -> Option<String> {
        self.artwork?.items.into_iter().find_map(|item| item.url)
    }
}

impl From<&Track> for MediaMetadata {
    fn from(track: &Track) -> Self {
        let artists: Vec<String> = track
            .artists
            .iter()
            .map(|artist| artist.name.clone())
            .collect();
        MediaMetadata {
            title: Some(track.title.clone()),
            artist: Some(artists.join(", ")),
            artists: Some(artists),
            album_title: track.album.as_ref().map(|album| album.title.clone()),
            duration: track
                .duration_ms
                .map(|millis| Duration::from_secs_f64(millis / 1000.0)),
            ..MediaMetadata::default()
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
enum Status {
    Playing,
    Paused,
    Stopped,
}

#[derive(Deserialize)]
pub struct PlaybackState {
    status: Status,
    seek: f64,
}

impl From<PlaybackState> for MediaPlayback {
    fn from(state: PlaybackState) -> Self {
        let progress = Some(MediaPosition(Duration::from_secs_f64(state.seek)));
        match state.status {
            Status::Playing => MediaPlayback::Playing { progress },
            Status::Paused => MediaPlayback::Paused { progress },
            Status::Stopped => MediaPlayback::Stopped,
        }
    }
}

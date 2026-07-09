use serde::Deserialize;
use sqlx::Row;

use crate::history::fingerprint;
use crate::history::HistoryDb;

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrackSnapshot {
    pub title: String,
    pub artists: Vec<String>,
    pub album_title: Option<String>,
    pub duration_ms: Option<i64>,
    pub artwork_url: Option<String>,
    pub provider: String,
    pub provider_id: String,
    pub started_at: i64,
}

#[derive(Clone, Copy, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum PlayEventKind {
    Started,
    Paused,
    Resumed,
    Seeked,
    Ended,
}

impl PlayEventKind {
    fn as_str(self) -> &'static str {
        match self {
            Self::Started => "started",
            Self::Paused => "paused",
            Self::Resumed => "resumed",
            Self::Seeked => "seeked",
            Self::Ended => "ended",
        }
    }
}

#[derive(Clone, Copy, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum EndReason {
    Completed,
    Skipped,
    Stopped,
    Replaced,
    Abandoned,
}

impl EndReason {
    fn as_str(self) -> &'static str {
        match self {
            Self::Completed => "completed",
            Self::Skipped => "skipped",
            Self::Stopped => "stopped",
            Self::Replaced => "replaced",
            Self::Abandoned => "abandoned",
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayEvent {
    pub play_id: i64,
    pub kind: PlayEventKind,
    pub at: i64,
    pub position_ms: i64,
    pub seek_to_ms: Option<i64>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayFinalization {
    pub play_id: i64,
    pub reason: EndReason,
    pub at: i64,
    pub position_ms: i64,
    pub ms_played: i64,
}

impl HistoryDb {
    fn pool(&self) -> &SqlitePool { &self.0 }

    async fn upsert_track(&self, snapshot: &TrackSnapshot) -> Result<i64, String> {
        let fp = fingerprint::fingerprint(&snapshot.artists, &snapshot.title);
        let artists_json = serde_json::to_string(&snapshot.artists)
            .map_err(|err| format!("Failed to serialize artists: {err}"))?;

        sqlx::query(
            "INSERT INTO tracks (fingerprint, title, artists, album_title, duration_ms, artwork_url, created_at, updated_at) \
             VALUES (?, ?, ?, ?, ?, ?, ?, ?) \
             ON CONFLICT(fingerprint) DO UPDATE SET \
             album_title = COALESCE(tracks.album_title, excluded.album_title), \
             duration_ms = COALESCE(tracks.duration_ms, excluded.duration_ms), \
             artwork_url = COALESCE(tracks.artwork_url, excluded.artwork_url), \
             updated_at = excluded.updated_at \
             RETURNING id",
        )
        .bind(&fp)
        .bind(&snapshot.title)
        .bind(&artists_json)
        .bind(&snapshot.album_title)
        .bind(snapshot.duration_ms)
        .bind(&snapshot.artwork_url)
        .bind(snapshot.started_at)
        .bind(snapshot.started_at)
        .fetch_one(self.pool())
        .await
        .map(|row| row.get("id"))
        .map_err(|err| format!("Failed to upsert track: {err}"))
    }

    pub async fn start_play(&self, snapshot: TrackSnapshot) -> Result<i64, String> {
        let _track_id = self.upsert_track(&snapshot).await?;
        todo!()
    }

    pub async fn record_event(&self, event: PlayEvent) -> Result<(), String> {
        todo!()
    }

    pub async fn finalize_play(&self, finalization: PlayFinalization) -> Result<(), String> {
        todo!()
    }
}

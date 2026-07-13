use serde::{Deserialize, Serialize};
use specta_typescript::Number;

#[derive(Clone, Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct TrackSnapshot {
    pub title: String,
    pub artists: Vec<String>,
    pub album_title: Option<String>,
    #[specta(type = Option<Number<i64>>)]
    pub duration_ms: Option<i64>,
    pub artwork_url: Option<String>,
    pub provider: String,
    pub provider_id: String,
}

#[derive(Clone, Copy, PartialEq, Deserialize, sqlx::Type, specta::Type)]
#[serde(rename_all = "camelCase")]
#[sqlx(rename_all = "lowercase")]
pub enum PlayEventKind {
    Started,
    Paused,
    Resumed,
    Seeked,
    Finished,
    Skipped,
    Stopped,
}

impl PlayEventKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Started => "started",
            Self::Paused => "paused",
            Self::Resumed => "resumed",
            Self::Seeked => "seeked",
            Self::Finished => "finished",
            Self::Skipped => "skipped",
            Self::Stopped => "stopped",
        }
    }
}

#[derive(Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PlayEvent {
    pub play_id: String,
    pub kind: PlayEventKind,
    #[specta(type = Number<i64>)]
    pub at: i64,
    #[specta(type = Number<i64>)]
    pub position_ms: i64,
    #[specta(type = Option<Number<i64>>)]
    pub seek_to_ms: Option<i64>,
    pub snapshot: Option<TrackSnapshot>,
}

#[derive(Clone, Copy, Debug, PartialEq, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum PlayEndReason {
    Finished,
    Skipped,
    Stopped,
}

#[derive(sqlx::FromRow)]
pub struct PlayEventLogRow {
    pub play_id: String,
    #[sqlx(flatten)]
    pub event: PlayEventRow,
}

#[derive(sqlx::FromRow)]
pub struct PlayEventRow {
    pub kind: PlayEventKind,
    pub at: i64,
    pub position_ms: i64,
}

#[derive(Debug, PartialEq)]
pub struct Play {
    pub started_at: i64,
    pub ms_played: i64,
    pub end_reason: Option<PlayEndReason>,
    pub end_position_ms: Option<i64>,
}

#[derive(sqlx::FromRow)]
pub struct StartedRow {
    pub play_id: String,
    pub provider: Option<String>,
    pub provider_id: Option<String>,
    pub title: String,
    pub artists: String,
    pub album_title: Option<String>,
    pub duration_ms: Option<i64>,
    pub artwork_url: Option<String>,
}

impl StartedRow {
    pub fn into_entry(self, play: Play) -> Result<HistoryEntry, String> {
        let artists: Vec<String> = serde_json::from_str(&self.artists).map_err(|err| {
            format!("Failed to parse artists for play '{}': {err}", self.play_id)
        })?;

        Ok(HistoryEntry {
            play_id: self.play_id,
            title: self.title,
            artists,
            album_title: self.album_title,
            duration_ms: self.duration_ms,
            artwork_url: self.artwork_url,
            provider: self.provider,
            provider_id: self.provider_id,
            started_at: play.started_at,
            ms_played: play.ms_played,
            end_reason: play.end_reason,
            end_position_ms: play.end_position_ms,
        })
    }
}

#[derive(Debug, PartialEq, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct HistoryEntry {
    pub play_id: String,
    pub title: String,
    pub artists: Vec<String>,
    pub album_title: Option<String>,
    #[specta(type = Option<Number<i64>>)]
    pub duration_ms: Option<i64>,
    pub artwork_url: Option<String>,
    pub provider: Option<String>,
    pub provider_id: Option<String>,
    #[specta(type = Number<i64>)]
    pub started_at: i64,
    #[specta(type = Number<i64>)]
    pub ms_played: i64,
    pub end_reason: Option<PlayEndReason>,
    #[specta(type = Option<Number<i64>>)]
    pub end_position_ms: Option<i64>,
}

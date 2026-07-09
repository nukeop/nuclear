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
    fn pool(&self) -> &SqlitePool {
        &self.0
    }

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

    // Called when a new track starts playing, to finalize any open plays
    // that might not have already been handled.
    async fn replace_open_plays(&self, at: i64) -> Result<(), String> {
        let open_ids: Vec<i64> = sqlx::query("SELECT id FROM plays WHERE end_reason IS NULL")
            .fetch_all(self.pool())
            .await
            .map(|rows| rows.iter().map(|row| row.get("id")).collect())
            .map_err(|err| format!("Failed to fetch open plays: {err}"))?;

        for play_id in open_ids {
            self.finalize_play(PlayFinalization {
                play_id,
                reason: EndReason::Replaced,
                at,
                position_ms: self.last_position(play_id).await?,
                ms_played: self.compute_ms_played(play_id, at).await?,
            })
            .await?;
        }

        Ok(())
    }

    async fn last_position(&self, play_id: i64) -> Result<i64, String> {
        sqlx::query(
            "SELECT position_ms FROM play_events WHERE play_id = ? ORDER BY at DESC LIMIT 1",
        )
        .bind(play_id)
        .fetch_one(self.pool())
        .await
        .map(|row| row.get("position_ms"))
        .map_err(|err| format!("Failed to fetch last position: {err}"))
    }

    async fn compute_ms_played(&self, play_id: i64, end_at: i64) -> Result<i64, String> {
        let events = sqlx::query("SELECT kind, at FROM play_events WHERE play_id = ? ORDER BY at")
            .bind(play_id)
            .fetch_all(self.pool())
            .await
            .map_err(|err| format!("Failed to fetch play events: {err}"))?;

        let mut ms_played: i64 = 0;
        let mut interval_start: Option<i64> = None;

        for event in &events {
            let kind: &str = event.get("kind");
            let at: i64 = event.get("at");

            match kind {
                "started" | "resumed" => {
                    interval_start = Some(at);
                }
                "paused" | "ended" => {
                    if let Some(start) = interval_start {
                        ms_played += at - start;
                        interval_start = None;
                    }
                }
                _ => {}
            }
        }

        if let Some(start) = interval_start {
            ms_played += end_at - start;
        }

        Ok(ms_played)
    }

    pub async fn start_play(&self, snapshot: TrackSnapshot) -> Result<i64, String> {
        let track_id = self.upsert_track(&snapshot).await?;
        self.replace_open_plays(snapshot.started_at).await?;

        let play_id: i64 = sqlx::query(
            "INSERT INTO plays (track_id, provider, provider_id, started_at) \
             VALUES (?, ?, ?, ?) RETURNING id",
        )
        .bind(track_id)
        .bind(&snapshot.provider)
        .bind(&snapshot.provider_id)
        .bind(snapshot.started_at)
        .fetch_one(self.pool())
        .await
        .map(|row| row.get("id"))
        .map_err(|err| format!("Failed to insert play: {err}"))?;

        sqlx::query(
            "INSERT INTO play_events (play_id, kind, at, position_ms) \
             VALUES (?, 'started', ?, 0)",
        )
        .bind(play_id)
        .bind(snapshot.started_at)
        .execute(self.pool())
        .await
        .map_err(|err| format!("Failed to insert started event: {err}"))?;

        Ok(play_id)
    }

    pub async fn record_event(&self, event: PlayEvent) -> Result<(), String> {
        sqlx::query(
            "INSERT INTO play_events (play_id, kind, at, position_ms, seek_to_ms) \
             VALUES (?, ?, ?, ?, ?)",
        )
        .bind(event.play_id)
        .bind(event.kind.as_str())
        .bind(event.at)
        .bind(event.position_ms)
        .bind(event.seek_to_ms)
        .execute(self.pool())
        .await
        .map_err(|err| format!("Failed to insert event: {err}"))?;

        Ok(())
    }

    pub async fn finalize_play(&self, finalization: PlayFinalization) -> Result<(), String> {
        let already_finalized: bool =
            sqlx::query("SELECT end_reason IS NOT NULL as finalized FROM plays WHERE id = ?")
                .bind(finalization.play_id)
                .fetch_one(self.pool())
                .await
                .map(|row| row.get("finalized"))
                .map_err(|err| format!("Failed to fetch play: {err}"))?;

        if already_finalized {
            return Ok(());
        }

        sqlx::query(
            "UPDATE plays SET ended_at = ?, end_reason = ?, end_position_ms = ?, ms_played = ? \
             WHERE id = ?",
        )
        .bind(finalization.at)
        .bind(finalization.reason.as_str())
        .bind(finalization.position_ms)
        .bind(finalization.ms_played)
        .bind(finalization.play_id)
        .execute(self.pool())
        .await
        .map_err(|err| format!("Failed to finalize play: {err}"))?;

        sqlx::query(
            "INSERT INTO play_events (play_id, kind, at, position_ms) \
             VALUES (?, 'ended', ?, ?)",
        )
        .bind(finalization.play_id)
        .bind(finalization.at)
        .bind(finalization.position_ms)
        .execute(self.pool())
        .await
        .map_err(|err| format!("Failed to insert ended event: {err}"))?;

        Ok(())
    }
}

use serde::{Deserialize, Serialize};
use specta_typescript::Number;
use sqlx::sqlite::SqlitePool;
use sqlx::Row;

use crate::history::fingerprint;
use crate::history::HistoryDb;

#[derive(Serialize, specta::Type)]
#[specta(type = Number<i64>)]
pub struct PlayId(pub i64);

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
    #[specta(type = Number<i64>)]
    pub started_at: i64,
}

#[derive(Clone, Copy, Deserialize, specta::Type)]
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

#[derive(Clone, Copy, Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum EndReason {
    /// Track played to the end naturally.
    Completed,
    /// User skipped to another track.
    Skipped,
    /// User explicitly stopped playback.
    Stopped,
    /// Another track started playing while this one was still open.
    Replaced,
    /// App exited or crashed while this track was playing.
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

#[derive(Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PlayEvent {
    #[specta(type = Number<i64>)]
    pub play_id: i64,
    pub kind: PlayEventKind,
    #[specta(type = Number<i64>)]
    pub at: i64,
    #[specta(type = Number<i64>)]
    pub position_ms: i64,
    #[specta(type = Option<Number<i64>>)]
    pub seek_to_ms: Option<i64>,
}

#[derive(Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PlayFinalization {
    #[specta(type = Number<i64>)]
    pub play_id: i64,
    pub reason: EndReason,
    #[specta(type = Number<i64>)]
    pub at: i64,
    #[specta(type = Number<i64>)]
    pub position_ms: i64,
    #[specta(type = Number<i64>)]
    pub ms_played: i64,
}

async fn last_event(
    conn: &mut sqlx::SqliteConnection,
    play_id: i64,
) -> Result<(i64, i64), String> {
    sqlx::query("SELECT at, position_ms FROM play_events WHERE play_id = ? ORDER BY at DESC LIMIT 1")
        .bind(play_id)
        .fetch_one(&mut *conn)
        .await
        .map(|row| (row.get("at"), row.get("position_ms")))
        .map_err(|err| format!("Failed to fetch last event: {err}"))
}

async fn do_finalize(
    conn: &mut sqlx::SqliteConnection,
    finalization: PlayFinalization,
) -> Result<(), String> {
    sqlx::query(
        "UPDATE plays SET ended_at = ?, end_reason = ?, end_position_ms = ?, ms_played = ? \
         WHERE id = ?",
    )
    .bind(finalization.at)
    .bind(finalization.reason.as_str())
    .bind(finalization.position_ms)
    .bind(finalization.ms_played)
    .bind(finalization.play_id)
    .execute(&mut *conn)
    .await
    .map_err(|err| format!("Failed to finalize play: {err}"))?;

    sqlx::query(
        "INSERT INTO play_events (play_id, kind, at, position_ms) \
         VALUES (?, 'ended', ?, ?)",
    )
    .bind(finalization.play_id)
    .bind(finalization.at)
    .bind(finalization.position_ms)
    .execute(&mut *conn)
    .await
    .map_err(|err| format!("Failed to insert ended event: {err}"))?;

    Ok(())
}

async fn compute_ms_played(
    conn: &mut sqlx::SqliteConnection,
    play_id: i64,
    end_at: i64,
) -> Result<i64, String> {
    let events = sqlx::query("SELECT kind, at FROM play_events WHERE play_id = ? ORDER BY at")
        .bind(play_id)
        .fetch_all(&mut *conn)
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

async fn fetch_open_play_ids(conn: &mut sqlx::SqliteConnection) -> Result<Vec<i64>, String> {
    sqlx::query("SELECT id FROM plays WHERE end_reason IS NULL")
        .fetch_all(&mut *conn)
        .await
        .map(|rows| rows.iter().map(|row| row.get("id")).collect())
        .map_err(|err| format!("Failed to fetch open plays: {err}"))
}

async fn finalize_one_open_play(
    conn: &mut sqlx::SqliteConnection,
    play_id: i64,
    end_at: i64,
    reason: EndReason,
) -> Result<(), String> {
    let (_, position_ms) = last_event(&mut *conn, play_id).await?;
    let ms_played = compute_ms_played(&mut *conn, play_id, end_at).await?;

    do_finalize(
        &mut *conn,
        PlayFinalization {
            play_id,
            reason,
            at: end_at,
            position_ms,
            ms_played,
        },
    )
    .await
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

    pub async fn close_open_plays_at(&self, now_ms: i64) -> Result<(), String> {
        self.finalize_all_open_plays(Some(now_ms), EndReason::Abandoned).await
    }

    pub async fn sweep_open_plays(&self) -> Result<(), String> {
        self.finalize_all_open_plays(None, EndReason::Abandoned).await
    }

    async fn replace_open_plays(&self, at: i64) -> Result<(), String> {
        self.finalize_all_open_plays(Some(at), EndReason::Replaced).await
    }

    async fn finalize_all_open_plays(
        &self,
        end_at: Option<i64>,
        reason: EndReason,
    ) -> Result<(), String> {
        let mut tx = self
            .pool()
            .begin()
            .await
            .map_err(|err| format!("Failed to begin transaction: {err}"))?;

        let open_ids = fetch_open_play_ids(&mut *tx).await?;
        for play_id in open_ids {
            let end_at = match end_at {
                Some(t) => t,
                None => last_event(&mut *tx, play_id).await?.0,
            };
            finalize_one_open_play(&mut *tx, play_id, end_at, reason).await?;
        }

        tx.commit()
            .await
            .map_err(|err| format!("Failed to commit transaction: {err}"))?;

        Ok(())
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

        let mut conn = self
            .pool()
            .acquire()
            .await
            .map_err(|err| format!("Failed to acquire connection: {err}"))?;
        do_finalize(&mut *conn, finalization).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::history::test_helpers::test_pool;

    fn snapshot() -> TrackSnapshot {
        TrackSnapshot {
            title: "Creep".into(),
            artists: vec!["Radiohead".into()],
            album_title: Some("Pablo Honey".into()),
            duration_ms: Some(240_000),
            artwork_url: Some("https://example.com/art.jpg".into()),
            provider: "youtube".into(),
            provider_id: "abc123".into(),
            started_at: 1000,
        }
    }

    async fn db() -> HistoryDb {
        HistoryDb(test_pool().await)
    }

    #[tokio::test]
    async fn start_and_finalize_play() {
        let db = db().await;

        let play_id = db.start_play(snapshot()).await.unwrap();

        db.record_event(PlayEvent {
            play_id,
            kind: PlayEventKind::Paused,
            at: 5000,
            position_ms: 4000,
            seek_to_ms: None,
        }).await.unwrap();

        db.record_event(PlayEvent {
            play_id,
            kind: PlayEventKind::Resumed,
            at: 8000,
            position_ms: 4000,
            seek_to_ms: None,
        }).await.unwrap();

        db.finalize_play(PlayFinalization {
            play_id,
            reason: EndReason::Completed,
            at: 245_000,
            position_ms: 240_000,
            ms_played: 240_000,
        }).await.unwrap();

        let play = sqlx::query("SELECT * FROM plays WHERE id = ?")
            .bind(play_id)
            .fetch_one(db.pool())
            .await
            .unwrap();

        assert_eq!(play.get::<Option<String>, _>("end_reason"), Some("completed".into()));
        assert_eq!(play.get::<Option<i64>, _>("ended_at"), Some(245_000));
        assert_eq!(play.get::<Option<i64>, _>("ms_played"), Some(240_000));
    }

    #[tokio::test]
    async fn starting_new_play_replaces_open_one() {
        let db = db().await;

        let first_id = db.start_play(snapshot()).await.unwrap();

        let mut second = snapshot();
        second.title = "Karma Police".into();
        second.started_at = 5000;
        let second_id = db.start_play(second).await.unwrap();

        let first = sqlx::query("SELECT end_reason, ended_at FROM plays WHERE id = ?")
            .bind(first_id)
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(first.get::<Option<String>, _>("end_reason"), Some("replaced".into()));
        assert_eq!(first.get::<Option<i64>, _>("ended_at"), Some(5000));

        let second = sqlx::query("SELECT end_reason FROM plays WHERE id = ?")
            .bind(second_id)
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(second.get::<Option<String>, _>("end_reason"), None);
    }

    #[tokio::test]
    async fn finalize_is_idempotent() {
        let db = db().await;
        let play_id = db.start_play(snapshot()).await.unwrap();

        let finalization = PlayFinalization {
            play_id,
            reason: EndReason::Completed,
            at: 241_000,
            position_ms: 240_000,
            ms_played: 240_000,
        };

        db.finalize_play(finalization).await.unwrap();
        db.finalize_play(PlayFinalization {
            play_id,
            reason: EndReason::Skipped,
            at: 300_000,
            position_ms: 100_000,
            ms_played: 100_000,
        }).await.unwrap();

        let play = sqlx::query("SELECT end_reason, ms_played FROM plays WHERE id = ?")
            .bind(play_id)
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(play.get::<Option<String>, _>("end_reason"), Some("completed".into()));
        assert_eq!(play.get::<Option<i64>, _>("ms_played"), Some(240_000));
    }

    #[tokio::test]
    async fn same_track_reuses_row_and_backfills_nulls() {
        let db = db().await;

        let mut first = snapshot();
        first.artwork_url = None;
        db.start_play(first).await.unwrap();

        let mut second = snapshot();
        second.album_title = Some("Greatest Hits".into());
        second.artwork_url = Some("https://example.com/new.jpg".into());
        second.started_at = 2000;
        db.start_play(second).await.unwrap();

        let count: i64 = sqlx::query("SELECT COUNT(*) as c FROM tracks")
            .fetch_one(db.pool())
            .await
            .unwrap()
            .get("c");
        assert_eq!(count, 1);

        let track = sqlx::query("SELECT album_title, artwork_url FROM tracks")
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(
            track.get::<Option<String>, _>("album_title"),
            Some("Pablo Honey".into()),
            "existing album_title should not be overwritten"
        );
        assert_eq!(
            track.get::<Option<String>, _>("artwork_url"),
            Some("https://example.com/new.jpg".into()),
            "NULL artwork_url should be backfilled"
        );
    }

    #[tokio::test]
    async fn sweep_closes_open_plays_conservatively() {
        let db = db().await;

        // started@1000, paused@3000 (2s played), resumed@5000
        // sweep should count: (3000-1000) + (5000-5000) = 2000
        // the trailing open interval gets zero because end_at = last event's timestamp
        let play_id = db.start_play(snapshot()).await.unwrap();
        db.record_event(PlayEvent {
            play_id, kind: PlayEventKind::Paused, at: 3000, position_ms: 2000, seek_to_ms: None,
        }).await.unwrap();
        db.record_event(PlayEvent {
            play_id, kind: PlayEventKind::Resumed, at: 5000, position_ms: 2000, seek_to_ms: None,
        }).await.unwrap();

        db.sweep_open_plays().await.unwrap();

        let play = sqlx::query("SELECT end_reason, ended_at, ms_played FROM plays WHERE id = ?")
            .bind(play_id)
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(play.get::<Option<String>, _>("end_reason"), Some("abandoned".into()));
        assert_eq!(play.get::<Option<i64>, _>("ended_at"), Some(5000));
        assert_eq!(play.get::<Option<i64>, _>("ms_played"), Some(2000));
    }

    #[tokio::test]
    async fn close_at_extends_trailing_interval() {
        let db = db().await;

        // started@1000, paused@3000 (2s), resumed@5000, close_at(10000)
        // ms_played: (3000-1000) + (10000-5000) = 2000 + 5000 = 7000
        let play_id = db.start_play(snapshot()).await.unwrap();
        db.record_event(PlayEvent {
            play_id, kind: PlayEventKind::Paused, at: 3000, position_ms: 2000, seek_to_ms: None,
        }).await.unwrap();
        db.record_event(PlayEvent {
            play_id, kind: PlayEventKind::Resumed, at: 5000, position_ms: 2000, seek_to_ms: None,
        }).await.unwrap();

        db.close_open_plays_at(10_000).await.unwrap();

        let play = sqlx::query("SELECT end_reason, ended_at, ms_played FROM plays WHERE id = ?")
            .bind(play_id)
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(play.get::<Option<String>, _>("end_reason"), Some("abandoned".into()));
        assert_eq!(play.get::<Option<i64>, _>("ended_at"), Some(10_000));
        assert_eq!(play.get::<Option<i64>, _>("ms_played"), Some(7000));
    }

    #[tokio::test]
    async fn replaced_play_gets_correct_ms_played() {
        let db = db().await;

        // started@1000, paused@3000 (2s played), resumed@5000, replaced@8000 (3s more)
        let play_id = db.start_play(snapshot()).await.unwrap();
        db.record_event(PlayEvent {
            play_id, kind: PlayEventKind::Paused, at: 3000, position_ms: 2000, seek_to_ms: None,
        }).await.unwrap();
        db.record_event(PlayEvent {
            play_id, kind: PlayEventKind::Resumed, at: 5000, position_ms: 2000, seek_to_ms: None,
        }).await.unwrap();

        let mut next = snapshot();
        next.title = "Karma Police".into();
        next.started_at = 8000;
        db.start_play(next).await.unwrap();

        let play = sqlx::query("SELECT ms_played FROM plays WHERE id = ?")
            .bind(play_id)
            .fetch_one(db.pool())
            .await
            .unwrap();
        // (3000-1000) + (8000-5000) = 2000 + 3000 = 5000
        assert_eq!(play.get::<Option<i64>, _>("ms_played"), Some(5000));
    }
}

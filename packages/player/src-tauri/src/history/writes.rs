use sqlx::Row;

use crate::history::fingerprint;
use crate::history::types::{PlayEvent, PlayEventKind, TrackSnapshot};
use crate::history::HistoryDb;

impl HistoryDb {
    async fn upsert_track(&self, snapshot: &TrackSnapshot, at: i64) -> Result<i64, String> {
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
        .bind(at)
        .bind(at)
        .fetch_one(self.pool())
        .await
        .map(|row| row.get("id"))
        .map_err(|err| format!("Failed to upsert track: {err}"))
    }

    pub async fn record_event(&self, event: PlayEvent) -> Result<(), String> {
        let is_started = matches!(event.kind, PlayEventKind::Started);
        if event.snapshot.is_some() != is_started {
            return Err(format!(
                "Event kind '{}' and snapshot presence do not match: only 'started' events carry a snapshot",
                event.kind.as_str()
            ));
        }

        let track_id = match &event.snapshot {
            Some(snapshot) => Some(self.upsert_track(snapshot, event.at).await?),
            None => None,
        };
        let provider_ref = event
            .snapshot
            .as_ref()
            .map(|snapshot| (snapshot.provider.clone(), snapshot.provider_id.clone()));
        let (provider, provider_id) = provider_ref.unzip();

        sqlx::query(
            "INSERT INTO play_events (play_id, track_id, kind, at, position_ms, seek_to_ms, provider, provider_id) \
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&event.play_id)
        .bind(track_id)
        .bind(event.kind)
        .bind(event.at)
        .bind(event.position_ms)
        .bind(event.seek_to_ms)
        .bind(provider)
        .bind(provider_id)
        .execute(self.pool())
        .await
        .map_err(|err| format!("Failed to insert event: {err}"))?;

        Ok(())
    }

    pub async fn delete_range(&self, from: i64, to: i64) -> Result<(), String> {
        let mut tx = self
            .pool()
            .begin()
            .await
            .map_err(|err| format!("Failed to start delete transaction: {err}"))?;

        sqlx::query(
            "DELETE FROM play_events WHERE play_id IN ( \
             SELECT play_id FROM play_events \
             WHERE kind = 'started' AND at >= ? AND at < ?)",
        )
        .bind(from)
        .bind(to)
        .execute(&mut *tx)
        .await
        .map_err(|err| format!("Failed to delete play events: {err}"))?;

        sqlx::query(
            "DELETE FROM tracks WHERE NOT EXISTS ( \
             SELECT 1 FROM play_events WHERE track_id = tracks.id)",
        )
        .execute(&mut *tx)
        .await
        .map_err(|err| format!("Failed to delete orphaned tracks: {err}"))?;

        tx.commit()
            .await
            .map_err(|err| format!("Failed to commit delete transaction: {err}"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::history::fixtures;

    fn snapshot() -> TrackSnapshot {
        TrackSnapshot {
            title: "Creep".into(),
            artists: vec!["Radiohead".into()],
            album_title: Some("Pablo Honey".into()),
            duration_ms: Some(240_000),
            artwork_url: Some("https://example.com/art.jpg".into()),
            provider: "youtube".into(),
            provider_id: "abc123".into(),
        }
    }

    fn started(play_id: &str, at: i64, snapshot: TrackSnapshot) -> PlayEvent {
        PlayEvent {
            play_id: play_id.into(),
            kind: PlayEventKind::Started,
            at,
            position_ms: 0,
            seek_to_ms: None,
            snapshot: Some(snapshot),
        }
    }

    fn bare(play_id: &str, kind: PlayEventKind, at: i64, position_ms: i64) -> PlayEvent {
        PlayEvent {
            play_id: play_id.into(),
            kind,
            at,
            position_ms,
            seek_to_ms: None,
            snapshot: None,
        }
    }

    async fn db() -> HistoryDb {
        HistoryDb(fixtures::pool().await)
    }

    #[tokio::test]
    async fn started_event_inserts_track_and_stamped_event_row() {
        let db = db().await;

        db.record_event(started("play-1", 1000, snapshot()))
            .await
            .unwrap();

        let track = sqlx::query("SELECT * FROM tracks")
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(track.get::<String, _>("title"), "Creep");
        assert_eq!(track.get::<String, _>("artists"), r#"["Radiohead"]"#);
        assert_eq!(track.get::<i64, _>("created_at"), 1000);

        let event = sqlx::query("SELECT * FROM play_events")
            .fetch_one(db.pool())
            .await
            .unwrap();
        assert_eq!(event.get::<String, _>("play_id"), "play-1");
        assert_eq!(
            event.get::<Option<i64>, _>("track_id"),
            Some(track.get::<i64, _>("id"))
        );
        assert_eq!(event.get::<String, _>("kind"), "started");
        assert_eq!(event.get::<i64, _>("at"), 1000);
        assert_eq!(event.get::<i64, _>("position_ms"), 0);
        assert_eq!(
            event.get::<Option<String>, _>("provider"),
            Some("youtube".into())
        );
        assert_eq!(
            event.get::<Option<String>, _>("provider_id"),
            Some("abc123".into())
        );
    }

    #[tokio::test]
    async fn same_track_reuses_row_and_backfills_nulls() {
        let db = db().await;

        let mut first = snapshot();
        first.artwork_url = None;
        db.record_event(started("play-1", 1000, first))
            .await
            .unwrap();

        let mut second = snapshot();
        second.album_title = Some("Greatest Hits".into());
        second.artwork_url = Some("https://example.com/new.jpg".into());
        db.record_event(started("play-2", 2000, second))
            .await
            .unwrap();

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
    async fn bare_events_append_rows_without_track_or_provider() {
        let db = db().await;

        db.record_event(started("play-1", 1000, snapshot()))
            .await
            .unwrap();
        db.record_event(bare("play-1", PlayEventKind::Paused, 3000, 2000))
            .await
            .unwrap();
        db.record_event(PlayEvent {
            play_id: "play-1".into(),
            kind: PlayEventKind::Seeked,
            at: 4000,
            position_ms: 2000,
            seek_to_ms: Some(60_000),
            snapshot: None,
        })
        .await
        .unwrap();
        db.record_event(bare("play-1", PlayEventKind::Finished, 245_000, 240_000))
            .await
            .unwrap();

        let events = sqlx::query(
            "SELECT kind, at, position_ms, seek_to_ms, track_id, provider FROM play_events \
             WHERE kind != 'started' ORDER BY at",
        )
        .fetch_all(db.pool())
        .await
        .unwrap();

        assert_eq!(events.len(), 3);

        assert_eq!(events[0].get::<String, _>("kind"), "paused");
        assert_eq!(events[0].get::<i64, _>("at"), 3000);
        assert_eq!(events[0].get::<i64, _>("position_ms"), 2000);
        assert_eq!(events[0].get::<Option<i64>, _>("seek_to_ms"), None);
        assert_eq!(events[0].get::<Option<i64>, _>("track_id"), None);
        assert_eq!(events[0].get::<Option<String>, _>("provider"), None);

        assert_eq!(events[1].get::<String, _>("kind"), "seeked");
        assert_eq!(events[1].get::<Option<i64>, _>("seek_to_ms"), Some(60_000));

        assert_eq!(events[2].get::<String, _>("kind"), "finished");
        assert_eq!(events[2].get::<i64, _>("position_ms"), 240_000);
    }

    #[tokio::test]
    async fn snapshot_on_non_started_event_is_rejected() {
        let db = db().await;

        let mut event = started("play-1", 1000, snapshot());
        event.kind = PlayEventKind::Paused;

        let result = db.record_event(event).await;
        assert_eq!(
            result,
            Err("Event kind 'paused' and snapshot presence do not match: only 'started' events carry a snapshot".into())
        );

        let count: i64 = sqlx::query("SELECT COUNT(*) as c FROM play_events")
            .fetch_one(db.pool())
            .await
            .unwrap()
            .get("c");
        assert_eq!(count, 0);
    }

    #[tokio::test]
    async fn started_without_snapshot_is_rejected() {
        let db = db().await;

        let result = db
            .record_event(bare("play-1", PlayEventKind::Started, 1000, 0))
            .await;
        assert_eq!(
            result,
            Err("Event kind 'started' and snapshot presence do not match: only 'started' events carry a snapshot".into())
        );
    }
}

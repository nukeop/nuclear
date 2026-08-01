use crate::history::types::{HistoryEntry, HistoryEntryRow};
use crate::history::HistoryDb;

impl HistoryDb {
    pub async fn entries(&self, limit: i64, offset: i64) -> Result<Vec<HistoryEntry>, String> {
        sqlx::query_as::<_, HistoryEntryRow>(
            "SELECT e.play_id, e.provider, e.provider_id, \
             t.title, t.artists, t.album_title, t.duration_ms, t.artwork_url, \
             e.at AS started_at, \
             COALESCE(p.ms_played, 0) AS ms_played, \
             p.end_reason, p.end_position_ms \
             FROM play_events e \
             JOIN tracks t ON t.id = e.track_id \
             LEFT JOIN play_listening_time p ON p.play_id = e.play_id \
             WHERE e.kind = 'started' \
             ORDER BY e.at DESC LIMIT ? OFFSET ?",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(self.pool())
        .await
        .map_err(|err| format!("Failed to fetch recent plays: {err}"))?
        .into_iter()
        .map(HistoryEntryRow::into_entry)
        .collect()
    }

    pub async fn count_plays(&self) -> Result<i64, String> {
        sqlx::query_scalar("SELECT COUNT(*) FROM play_events WHERE kind = 'started'")
            .fetch_one(self.pool())
            .await
            .map_err(|err| format!("Failed to count plays: {err}"))
    }
}

#[cfg(test)]
mod tests {
    use crate::history::fixtures;
    use crate::history::types::{
        HistoryEntry, PlayEndReason, PlayEvent, PlayEventKind, TrackSnapshot,
    };
    use crate::history::HistoryDb;

    fn play_ids(entries: &[HistoryEntry]) -> Vec<&str> {
        entries.iter().map(|entry| entry.play_id.as_str()).collect()
    }

    #[tokio::test]
    async fn entries_returns_track_metadata_with_each_play() {
        let db = HistoryDb(fixtures::pool().await);

        db.record_event(PlayEvent {
            play_id: "play-1".into(),
            kind: PlayEventKind::Started,
            at: 1000,
            position_ms: 0,
            seek_to_ms: None,
            snapshot: Some(TrackSnapshot {
                title: "Creep".into(),
                artists: vec!["Radiohead".into()],
                album_title: Some("Pablo Honey".into()),
                duration_ms: Some(240_000),
                artwork_url: Some("https://example.com/art.jpg".into()),
                provider: "youtube".into(),
                provider_id: "abc123".into(),
            }),
        })
        .await
        .unwrap();

        db.record_event(PlayEvent {
            play_id: "play-1".into(),
            kind: PlayEventKind::Finished,
            at: 241_000,
            position_ms: 240_000,
            seek_to_ms: None,
            snapshot: None,
        })
        .await
        .unwrap();

        let entries = db.entries(10, 0).await.unwrap();
        assert_eq!(entries.len(), 1);
        assert_eq!(
            entries[0],
            HistoryEntry {
                play_id: "play-1".into(),
                title: "Creep".into(),
                artists: vec!["Radiohead".into()],
                album_title: Some("Pablo Honey".into()),
                duration_ms: Some(240_000),
                artwork_url: Some("https://example.com/art.jpg".into()),
                provider: Some("youtube".into()),
                provider_id: Some("abc123".into()),
                started_at: 1000,
                ms_played: 240_000,
                end_reason: Some(PlayEndReason::Finished),
                end_position_ms: Some(240_000),
            }
        );
    }

    #[tokio::test]
    async fn entries_orders_newest_first() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_finished_play(&db, "play-1", "First", 1000).await;
        fixtures::seed_finished_play(&db, "play-2", "Second", 5000).await;
        fixtures::seed_finished_play(&db, "play-3", "Third", 9000).await;

        let entries = db.entries(10, 0).await.unwrap();

        assert_eq!(play_ids(&entries), ["play-3", "play-2", "play-1"]);
    }

    #[tokio::test]
    async fn entries_paginates_with_limit_and_offset() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_finished_play(&db, "play-1", "First", 1000).await;
        fixtures::seed_finished_play(&db, "play-2", "Second", 5000).await;
        fixtures::seed_finished_play(&db, "play-3", "Third", 9000).await;

        let first_page = db.entries(2, 0).await.unwrap();
        let second_page = db.entries(2, 2).await.unwrap();

        assert_eq!(play_ids(&first_page), ["play-3", "play-2"]);
        assert_eq!(play_ids(&second_page), ["play-1"]);
    }

    #[tokio::test]
    async fn entries_includes_interrupted_plays() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_started(&db, "play-1", "Interrupted", 1000).await;

        let entries = db.entries(10, 0).await.unwrap();

        assert_eq!(play_ids(&entries), ["play-1"]);
        assert_eq!(entries[0].end_reason, None);
        assert_eq!(entries[0].end_position_ms, None);
    }

    #[tokio::test]
    async fn seeking_while_paused_does_not_count_as_listening_time() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_events_for(
            &db,
            "play-1",
            &fixtures::track_snapshot("Creep"),
            &[
                (PlayEventKind::Started, 1000, 0),
                (PlayEventKind::Paused, 2000, 1000),
                (PlayEventKind::Seeked, 3000, 1000),
                (PlayEventKind::Resumed, 4000, 60_000),
                (PlayEventKind::Finished, 5000, 61_000),
            ],
        )
        .await;

        let entries = db.entries(10, 0).await.unwrap();

        assert_eq!(entries[0].ms_played, 2000);
    }

    #[tokio::test]
    async fn entries_record_the_position_a_play_was_abandoned_at() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_events_for(
            &db,
            "play-1",
            &fixtures::track_snapshot("Skipped"),
            &[
                (PlayEventKind::Started, 1000, 0),
                (PlayEventKind::Skipped, 4000, 3000),
            ],
        )
        .await;
        fixtures::seed_events_for(
            &db,
            "play-2",
            &fixtures::track_snapshot("Stopped"),
            &[
                (PlayEventKind::Started, 5000, 0),
                (PlayEventKind::Stopped, 6500, 1500),
            ],
        )
        .await;

        let entries = db.entries(10, 0).await.unwrap();

        assert_eq!(
            entries
                .iter()
                .map(|entry| (entry.end_reason, entry.end_position_ms))
                .collect::<Vec<_>>(),
            [
                (Some(PlayEndReason::Stopped), Some(1500)),
                (Some(PlayEndReason::Skipped), Some(3000)),
            ]
        );
    }

    #[tokio::test]
    async fn count_plays_counts_plays() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_finished_play(&db, "play-1", "First", 1000).await;
        fixtures::seed_finished_play(&db, "play-2", "Second", 5000).await;

        assert_eq!(db.count_plays().await.unwrap(), 2);
    }

    #[tokio::test]
    async fn delete_range_removes_plays_started_within_it_and_keeps_the_rest() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_finished_play(&db, "play-1", "First", 1000).await;
        fixtures::seed_finished_play(&db, "play-2", "Second", 5000).await;
        fixtures::seed_finished_play(&db, "play-3", "Third", 9000).await;

        db.delete_range(1000, 5000).await.unwrap();

        assert_eq!(
            play_ids(&db.entries(10, 0).await.unwrap()),
            ["play-3", "play-2"],
        );
    }

    #[tokio::test]
    async fn delete_range_drops_tracks_that_no_longer_have_any_plays() {
        let db = HistoryDb(fixtures::pool().await);
        fixtures::seed_finished_play(&db, "play-1", "Kept", 1000).await;
        fixtures::seed_finished_play(&db, "play-2", "Deleted", 5000).await;

        db.delete_range(5000, 6000).await.unwrap();

        let titles: Vec<String> = sqlx::query_scalar("SELECT title FROM tracks")
            .fetch_all(&db.0)
            .await
            .unwrap();
        assert_eq!(titles, ["Kept"]);
    }
}

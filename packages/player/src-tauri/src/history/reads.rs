use std::collections::HashMap;

use crate::history::types::{
    HistoryEntry, Play, PlayEndReason, PlayEventKind, PlayEventLogRow, PlayEventRow, StartedRow,
};
use crate::history::HistoryDb;

impl PlayEndReason {
    fn from_terminal_kind(kind: PlayEventKind) -> Option<PlayEndReason> {
        match kind {
            PlayEventKind::Finished => Some(Self::Finished),
            PlayEventKind::Skipped => Some(Self::Skipped),
            PlayEventKind::Stopped => Some(Self::Stopped),
            PlayEventKind::Started
            | PlayEventKind::Paused
            | PlayEventKind::Resumed
            | PlayEventKind::Seeked => None,
        }
    }
}

impl Play {
    pub fn from_events(events: &[PlayEventRow]) -> Option<Play> {
        let first = events.first()?;
        let last = events.last()?;

        let mut ms_played = 0;
        let mut audible_since: Option<i64> = None;

        for event in events {
            match event.kind {
                PlayEventKind::Started | PlayEventKind::Resumed => {
                    audible_since.get_or_insert(event.at);
                }
                PlayEventKind::Seeked => {}
                PlayEventKind::Paused
                | PlayEventKind::Finished
                | PlayEventKind::Skipped
                | PlayEventKind::Stopped => {
                    if let Some(since) = audible_since.take() {
                        ms_played += event.at - since;
                    }
                }
            }
        }

        if let Some(since) = audible_since {
            ms_played += last.at - since;
        }

        let end_reason = PlayEndReason::from_terminal_kind(last.kind);
        let end_position_ms = end_reason.map(|_| last.position_ms);

        Some(Play {
            started_at: first.at,
            ms_played,
            end_reason,
            end_position_ms,
        })
    }
}

impl HistoryDb {
    pub async fn entries(&self, limit: i64, offset: i64) -> Result<Vec<HistoryEntry>, String> {
        let starts = sqlx::query_as::<_, StartedRow>(
            "SELECT e.play_id, e.provider, e.provider_id, \
             t.title, t.artists, t.album_title, t.duration_ms, t.artwork_url \
             FROM play_events e JOIN tracks t ON t.id = e.track_id \
             WHERE e.kind = 'started' \
             ORDER BY e.at DESC LIMIT ? OFFSET ?",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(self.pool())
        .await
        .map_err(|err| format!("Failed to fetch recent plays: {err}"))?;

        if starts.is_empty() {
            return Ok(Vec::new());
        }

        let play_ids: Vec<&str> = starts.iter().map(|row| row.play_id.as_str()).collect();
        let mut events_by_play = self.events_by_play(&play_ids).await?;

        starts
            .into_iter()
            .map(|start| {
                let events = events_by_play.remove(&start.play_id).unwrap_or_default();
                let play = Play::from_events(&events)
                    .ok_or_else(|| format!("Play '{}' has no events", start.play_id))?;
                start.into_entry(play)
            })
            .collect()
    }

    pub async fn count_plays(&self) -> Result<i64, String> {
        sqlx::query_scalar("SELECT COUNT(*) FROM play_events WHERE kind = 'started'")
            .fetch_one(self.pool())
            .await
            .map_err(|err| format!("Failed to count plays: {err}"))
    }

    async fn events_by_play(
        &self,
        play_ids: &[&str],
    ) -> Result<HashMap<String, Vec<PlayEventRow>>, String> {
        let placeholders = vec!["?"; play_ids.len()].join(", ");
        let sql = format!(
            "SELECT play_id, kind, at, position_ms FROM play_events \
             WHERE play_id IN ({placeholders}) ORDER BY at, id",
        );
        let query = play_ids
            .iter()
            .fold(sqlx::query_as::<_, PlayEventLogRow>(&sql), |query, id| {
                query.bind(*id)
            });
        let rows = query
            .fetch_all(self.pool())
            .await
            .map_err(|err| format!("Failed to fetch play events: {err}"))?;

        let mut grouped: HashMap<String, Vec<PlayEventRow>> = HashMap::new();
        for row in rows {
            grouped.entry(row.play_id).or_default().push(row.event);
        }
        Ok(grouped)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::history::test_helpers::test_pool;
    use crate::history::types::{HistoryEntry, PlayEvent, TrackSnapshot};
    use crate::history::HistoryDb;

    fn event(kind: PlayEventKind, at: i64, position_ms: i64) -> PlayEventRow {
        PlayEventRow {
            kind,
            at,
            position_ms,
        }
    }

    fn snapshot(title: &str) -> TrackSnapshot {
        TrackSnapshot {
            title: title.into(),
            artists: vec!["Test Artist".into()],
            album_title: None,
            duration_ms: None,
            artwork_url: None,
            provider: "test".into(),
            provider_id: title.to_lowercase(),
        }
    }

    async fn seed_started(db: &HistoryDb, play_id: &str, title: &str, at: i64) {
        db.record_event(PlayEvent {
            play_id: play_id.into(),
            kind: PlayEventKind::Started,
            at,
            position_ms: 0,
            seek_to_ms: None,
            snapshot: Some(snapshot(title)),
        })
        .await
        .unwrap();
    }

    async fn seed_finished_play(db: &HistoryDb, play_id: &str, title: &str, at: i64) {
        seed_started(db, play_id, title, at).await;
        db.record_event(PlayEvent {
            play_id: play_id.into(),
            kind: PlayEventKind::Finished,
            at: at + 1000,
            position_ms: 1000,
            seek_to_ms: None,
            snapshot: None,
        })
        .await
        .unwrap();
    }

    fn play_ids(entries: &[HistoryEntry]) -> Vec<&str> {
        entries.iter().map(|entry| entry.play_id.as_str()).collect()
    }

    #[test]
    fn finished_play_sums_playing_time_and_excludes_pauses() {
        let play = Play::from_events(&[
            event(PlayEventKind::Started, 1000, 0),
            event(PlayEventKind::Paused, 3000, 2000),
            event(PlayEventKind::Resumed, 5000, 2000),
            event(PlayEventKind::Finished, 8000, 5000),
        ])
        .unwrap();

        assert_eq!(
            play,
            Play {
                started_at: 1000,
                ms_played: 5000,
                end_reason: Some(PlayEndReason::Finished),
                end_position_ms: Some(5000),
            }
        );
    }

    #[test]
    fn seeking_while_playing_still_counts_as_listening_time() {
        let play = Play::from_events(&[
            event(PlayEventKind::Started, 1000, 0),
            event(PlayEventKind::Seeked, 3000, 2000),
            event(PlayEventKind::Paused, 5000, 62_000),
        ])
        .unwrap();

        assert_eq!(play.ms_played, 4000);
    }

    #[test]
    fn seeking_while_paused_does_not_count_as_listening_time() {
        let play = Play::from_events(&[
            event(PlayEventKind::Started, 1000, 0),
            event(PlayEventKind::Paused, 2000, 1000),
            event(PlayEventKind::Seeked, 3000, 1000),
            event(PlayEventKind::Resumed, 4000, 60_000),
            event(PlayEventKind::Finished, 5000, 61_000),
        ])
        .unwrap();

        assert_eq!(play.ms_played, 2000);
    }

    #[test]
    fn interrupted_play_has_no_end_reason_and_counts_time_up_to_its_last_event() {
        let play = Play::from_events(&[
            event(PlayEventKind::Started, 1000, 0),
            event(PlayEventKind::Paused, 3000, 2000),
            event(PlayEventKind::Resumed, 5000, 2000),
        ])
        .unwrap();

        assert_eq!(
            play,
            Play {
                started_at: 1000,
                ms_played: 2000,
                end_reason: None,
                end_position_ms: None,
            }
        );
    }

    #[test]
    fn skipped_play_records_the_position_at_the_moment_of_skipping() {
        let play = Play::from_events(&[
            event(PlayEventKind::Started, 1000, 0),
            event(PlayEventKind::Skipped, 4000, 3000),
        ])
        .unwrap();

        assert_eq!(
            play,
            Play {
                started_at: 1000,
                ms_played: 3000,
                end_reason: Some(PlayEndReason::Skipped),
                end_position_ms: Some(3000),
            }
        );
    }

    #[test]
    fn stopped_play_records_the_position_at_the_moment_of_stopping() {
        let play = Play::from_events(&[
            event(PlayEventKind::Started, 1000, 0),
            event(PlayEventKind::Stopped, 2500, 1500),
        ])
        .unwrap();

        assert_eq!(
            play,
            Play {
                started_at: 1000,
                ms_played: 1500,
                end_reason: Some(PlayEndReason::Stopped),
                end_position_ms: Some(1500),
            }
        );
    }

    #[test]
    fn no_events_produce_no_play() {
        assert_eq!(Play::from_events(&[]), None);
    }

    #[tokio::test]
    async fn entries_returns_track_metadata_with_each_play() {
        let db = HistoryDb(test_pool().await);

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
        let db = HistoryDb(test_pool().await);
        seed_finished_play(&db, "play-1", "First", 1000).await;
        seed_finished_play(&db, "play-2", "Second", 5000).await;
        seed_finished_play(&db, "play-3", "Third", 9000).await;

        let entries = db.entries(10, 0).await.unwrap();

        assert_eq!(play_ids(&entries), ["play-3", "play-2", "play-1"]);
    }

    #[tokio::test]
    async fn entries_paginates_with_limit_and_offset() {
        let db = HistoryDb(test_pool().await);
        seed_finished_play(&db, "play-1", "First", 1000).await;
        seed_finished_play(&db, "play-2", "Second", 5000).await;
        seed_finished_play(&db, "play-3", "Third", 9000).await;

        let first_page = db.entries(2, 0).await.unwrap();
        let second_page = db.entries(2, 2).await.unwrap();

        assert_eq!(play_ids(&first_page), ["play-3", "play-2"]);
        assert_eq!(play_ids(&second_page), ["play-1"]);
    }

    #[tokio::test]
    async fn entries_includes_interrupted_plays() {
        let db = HistoryDb(test_pool().await);
        seed_started(&db, "play-1", "Interrupted", 1000).await;

        let entries = db.entries(10, 0).await.unwrap();

        assert_eq!(play_ids(&entries), ["play-1"]);
        assert_eq!(entries[0].end_reason, None);
        assert_eq!(entries[0].end_position_ms, None);
    }

    #[tokio::test]
    async fn count_plays_counts_plays() {
        let db = HistoryDb(test_pool().await);
        seed_finished_play(&db, "play-1", "First", 1000).await;
        seed_finished_play(&db, "play-2", "Second", 5000).await;

        assert_eq!(db.count_plays().await.unwrap(), 2);
    }

    #[tokio::test]
    async fn delete_range_removes_plays_started_within_it_and_keeps_the_rest() {
        let db = HistoryDb(test_pool().await);
        seed_finished_play(&db, "play-1", "First", 1000).await;
        seed_finished_play(&db, "play-2", "Second", 5000).await;
        seed_finished_play(&db, "play-3", "Third", 9000).await;

        db.delete_range(1000, 5000).await.unwrap();

        assert_eq!(
            play_ids(&db.entries(10, 0).await.unwrap()),
            ["play-3", "play-2"],
        );
    }

    #[tokio::test]
    async fn delete_range_drops_tracks_that_no_longer_have_any_plays() {
        let db = HistoryDb(test_pool().await);
        seed_finished_play(&db, "play-1", "Kept", 1000).await;
        seed_finished_play(&db, "play-2", "Deleted", 5000).await;

        db.delete_range(5000, 6000).await.unwrap();

        let titles: Vec<String> = sqlx::query_scalar("SELECT title FROM tracks")
            .fetch_all(&db.0)
            .await
            .unwrap();
        assert_eq!(titles, ["Kept"]);
    }
}

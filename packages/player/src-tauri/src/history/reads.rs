use crate::history::types::{Play, PlayEndReason, PlayEventKind, PlayEventRow};

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
    async fn recent_plays_returns_track_metadata_with_each_play() {
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

        let entries = HistoryDb::recent_plays(&db.0, 10, 0).await.unwrap();
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
    async fn recent_plays_orders_newest_first() {}

    #[tokio::test]
    async fn recent_plays_paginates_with_limit_and_offset() {}

    #[tokio::test]
    async fn recent_plays_includes_interrupted_plays() {}

    #[tokio::test]
    async fn clear_empties_history_and_recording_still_works_afterwards() {}
}

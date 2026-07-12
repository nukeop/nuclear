use crate::history::types::{Play, PlayEndReason, PlayEventKind, PlayEventRow};

impl Play {
    pub fn from_events(events: &[PlayEventRow]) -> Option<Play> {
        let _ = events;
        todo!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
    fn seeking_while_playing_still_counts_as_listening_time() {}

    #[test]
    fn seeking_while_paused_does_not_count_as_listening_time() {}

    #[test]
    fn interrupted_play_has_no_end_reason_and_counts_time_up_to_its_last_event() {}

    #[test]
    fn skipped_play_records_the_position_at_the_moment_of_skipping() {}

    #[test]
    fn stopped_play_records_the_position_at_the_moment_of_stopping() {}

    #[test]
    fn no_events_produce_no_play() {}
}

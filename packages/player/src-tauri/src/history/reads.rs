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

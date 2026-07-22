use serde::Serialize;
use specta_typescript::Number;

use crate::history::HistoryDb;

#[derive(Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct HourlyListeningTime {
    #[specta(type = Vec<Number<i64>>)]
    pub values: Vec<i64>,
}

const HOURLY_SQL: &str = "\
    WITH ordered AS ( \
        SELECT kind, at, \
            LAG(kind) OVER w AS prev_kind, \
            LAG(at) OVER w AS prev_at, \
            FIRST_VALUE(at) OVER w AS play_started_at \
        FROM play_events \
        WHERE kind <> 'seeked' \
        WINDOW w AS (PARTITION BY play_id ORDER BY at, id) \
    ) \
    SELECT \
        CAST(strftime('%H', play_started_at / 1000, 'unixepoch', 'localtime') AS INTEGER) AS hour, \
        SUM(at - prev_at) AS ms_played \
    FROM ordered \
    WHERE kind IN ('paused', 'finished', 'skipped', 'stopped') \
        AND prev_kind IN ('started', 'resumed') \
        AND play_started_at >= ? AND play_started_at <= ? \
    GROUP BY hour";

impl HistoryDb {
    pub async fn hourly_listening_time(&self, from: i64, to: i64) -> Result<Vec<i64>, String> {
        let rows: Vec<(i64, i64)> = sqlx::query_as(HOURLY_SQL)
            .bind(from)
            .bind(to)
            .fetch_all(self.pool())
            .await
            .map_err(|err| format!("Failed to aggregate hourly stats: {err}"))?;

        let mut buckets = vec![0; 24];
        for (hour, ms_played) in rows {
            buckets[hour as usize] = ms_played;
        }
        Ok(buckets)
    }
}

#[cfg(test)]
mod tests {
    use chrono::{Local, TimeZone};

    use crate::history::fixtures;
    use crate::history::types::PlayEventKind;
    use crate::history::HistoryDb;

    async fn seed_play(db: &HistoryDb, play_id: &str, started_at: i64, ms_played: i64) {
        fixtures::seed_events(
            db,
            play_id,
            "Creep",
            &[
                (PlayEventKind::Started, started_at),
                (PlayEventKind::Finished, started_at + ms_played),
            ],
        )
        .await;
    }

    fn local_time(hour: u32) -> i64 {
        Local
            .with_ymd_and_hms(2026, 7, 15, hour, 0, 0)
            .unwrap()
            .timestamp_millis()
    }

    #[tokio::test]
    async fn credits_listening_time_to_the_hour_a_play_started_in() {
        let db = HistoryDb(fixtures::pool().await);
        seed_play(&db, "play-1", local_time(14), 90_000).await;

        let stats = db.hourly_listening_time(0, i64::MAX).await.unwrap();

        assert_eq!(stats[14], 90_000);
        assert_eq!(stats.iter().sum::<i64>(), 90_000);
    }

    #[tokio::test]
    async fn excludes_paused_time_from_the_hourly_total() {
        let db = HistoryDb(fixtures::pool().await);
        let start = local_time(9);
        fixtures::seed_events(
            &db,
            "play-1",
            "Creep",
            &[
                (PlayEventKind::Started, start),
                (PlayEventKind::Paused, start + 2_000),
                (PlayEventKind::Resumed, start + 10_000),
                (PlayEventKind::Finished, start + 13_000),
            ],
        )
        .await;

        let stats = db.hourly_listening_time(0, i64::MAX).await.unwrap();

        assert_eq!(stats[9], 5_000);
    }

    #[tokio::test]
    async fn seeking_while_playing_does_not_interrupt_listening_time() {
        let db = HistoryDb(fixtures::pool().await);
        let start = local_time(21);
        fixtures::seed_events(
            &db,
            "play-1",
            "Creep",
            &[
                (PlayEventKind::Started, start),
                (PlayEventKind::Seeked, start + 3_000),
                (PlayEventKind::Paused, start + 5_000),
            ],
        )
        .await;

        let stats = db.hourly_listening_time(0, i64::MAX).await.unwrap();

        assert_eq!(stats[21], 5_000);
    }

    #[tokio::test]
    async fn accumulates_listening_time_from_multiple_plays_in_the_same_hour() {
        let db = HistoryDb(fixtures::pool().await);
        let start = local_time(15);
        seed_play(&db, "play-1", start, 30_000).await;
        seed_play(&db, "play-2", start + 60_000, 45_000).await;

        let stats = db.hourly_listening_time(0, i64::MAX).await.unwrap();

        assert_eq!(stats[15], 75_000);
    }

    #[tokio::test]
    async fn excludes_plays_started_outside_the_requested_range() {
        let db = HistoryDb(fixtures::pool().await);
        let before = local_time(10);
        let inside = local_time(14);
        let after = local_time(22);
        seed_play(&db, "play-before", before, 60_000).await;
        seed_play(&db, "play-inside", inside, 90_000).await;
        seed_play(&db, "play-after", after, 30_000).await;

        let stats = db.hourly_listening_time(inside, after - 1).await.unwrap();

        assert_eq!(stats[14], 90_000);
        assert_eq!(stats.iter().sum::<i64>(), 90_000);
    }
}

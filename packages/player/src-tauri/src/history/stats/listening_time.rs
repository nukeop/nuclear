use crate::history::HistoryDb;

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

    use crate::history::test_helpers::test_pool;
    use crate::history::types::{PlayEvent, PlayEventKind, TrackSnapshot};
    use crate::history::HistoryDb;

    async fn seed_play(db: &HistoryDb, play_id: &str, started_at: i64, ms_played: i64) {
        db.record_event(PlayEvent {
            play_id: play_id.into(),
            kind: PlayEventKind::Started,
            at: started_at,
            position_ms: 0,
            seek_to_ms: None,
            snapshot: Some(TrackSnapshot {
                title: "Creep".into(),
                artists: vec!["Radiohead".into()],
                album_title: None,
                duration_ms: None,
                artwork_url: None,
                provider: "test".into(),
                provider_id: "creep".into(),
            }),
        })
        .await
        .unwrap();
        db.record_event(PlayEvent {
            play_id: play_id.into(),
            kind: PlayEventKind::Finished,
            at: started_at + ms_played,
            position_ms: ms_played,
            seek_to_ms: None,
            snapshot: None,
        })
        .await
        .unwrap();
    }

    fn local_time(hour: u32) -> i64 {
        Local
            .with_ymd_and_hms(2026, 7, 15, hour, 0, 0)
            .unwrap()
            .timestamp_millis()
    }

    #[tokio::test]
    async fn credits_listening_time_to_the_hour_a_play_started_in() {
        let db = HistoryDb(test_pool().await);
        seed_play(&db, "play-1", local_time(14), 90_000).await;

        let stats = db.hourly_listening_time(0, i64::MAX).await.unwrap();

        assert_eq!(stats[14], 90_000);
        assert_eq!(stats.iter().sum::<i64>(), 90_000);
    }
}

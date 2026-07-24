use serde::Serialize;
use specta_typescript::Number;

use crate::history::HistoryDb;

#[derive(Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct HourlyListeningTime {
    #[specta(type = Vec<Number<i64>>)]
    pub values: Vec<i64>,
}

#[derive(Debug, PartialEq, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct DailyListeningTime {
    pub date: String,
    #[specta(type = Number<i64>)]
    pub value: i64,
}

impl HistoryDb {
    pub async fn hourly_listening_time(&self, from: i64, to: i64) -> Result<Vec<i64>, String> {
        let rows: Vec<(i64, i64)> = sqlx::query_as(
            "\
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
            GROUP BY hour",
        )
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

    pub async fn daily_listening_time(
        &self,
        from: i64,
        to: i64,
    ) -> Result<Vec<DailyListeningTime>, String> {
        let rows: Vec<(String, i64)> = sqlx::query_as(
            "\
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
                date(play_started_at / 1000, 'unixepoch', 'localtime') AS day, \
                SUM(at - prev_at) AS ms_played \
            FROM ordered \
            WHERE kind IN ('paused', 'finished', 'skipped', 'stopped') \
                AND prev_kind IN ('started', 'resumed') \
                AND play_started_at >= ? AND play_started_at <= ? \
            GROUP BY day \
            ORDER BY day",
        )
        .bind(from)
        .bind(to)
        .fetch_all(self.pool())
        .await
        .map_err(|err| format!("Failed to aggregate daily stats: {err}"))?;

        Ok(rows
            .into_iter()
            .map(|(date, value)| DailyListeningTime { date, value })
            .collect())
    }
}

#[cfg(test)]
#[path = "listening_time.test.rs"]
mod tests;

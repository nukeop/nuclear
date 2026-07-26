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

#[derive(Debug, PartialEq, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct FirstPlay {
    #[specta(type = Number<i64>)]
    pub at: i64,
}

impl HistoryDb {
    pub async fn hourly_listening_time(&self, from: i64, to: i64) -> Result<Vec<i64>, String> {
        let rows: Vec<(i64, i64)> = sqlx::query_as(
            "\
            SELECT \
                CAST(strftime('%H', started_at / 1000, 'unixepoch', 'localtime') AS INTEGER) AS hour, \
                SUM(ms_played) AS ms_played \
            FROM play_listening_time \
            WHERE started_at >= ? AND started_at <= ? \
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
            WITH RECURSIVE dates(day) AS ( \
                SELECT date(?1 / 1000, 'unixepoch', 'localtime') \
                UNION ALL \
                SELECT date(day, '+1 day') FROM dates \
                WHERE day < date(?2 / 1000, 'unixepoch', 'localtime') \
            ), \
            daily_totals AS ( \
                SELECT \
                    date(started_at / 1000, 'unixepoch', 'localtime') AS day, \
                    SUM(ms_played) AS ms_played \
                FROM play_listening_time \
                WHERE started_at >= ?1 AND started_at <= ?2 \
                GROUP BY day \
            ) \
            SELECT dates.day, COALESCE(daily_totals.ms_played, 0) \
            FROM dates \
            LEFT JOIN daily_totals ON daily_totals.day = dates.day \
            ORDER BY dates.day",
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

    pub async fn first_play_at(&self) -> Result<Option<FirstPlay>, String> {
        let at: Option<i64> =
            sqlx::query_scalar("SELECT MIN(at) FROM play_events WHERE kind = 'started'")
                .fetch_one(self.pool())
                .await
                .map_err(|err| format!("Failed to fetch first play: {err}"))?;

        Ok(at.map(|at| FirstPlay { at }))
    }
}

#[cfg(test)]
#[path = "listening_time.test.rs"]
mod tests;

use serde::Serialize;
use specta_typescript::Number;

use crate::history::HistoryDb;

#[derive(Debug, PartialEq, Serialize, specta::Type, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct TopArtist {
    pub name: String,
    pub artwork_url: Option<String>,
    #[specta(type = Number<i64>)]
    pub ms_played: i64,
    #[specta(type = Number<i64>)]
    pub plays: i64,
}

#[derive(Debug, PartialEq, Serialize, specta::Type, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct TopAlbum {
    pub title: String,
    pub artist: String,
    pub artwork_url: Option<String>,
    #[specta(type = Number<i64>)]
    pub ms_played: i64,
    #[specta(type = Number<i64>)]
    pub plays: i64,
}

#[derive(Debug, PartialEq, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct TopTrack {
    pub title: String,
    pub artists: Vec<String>,
    pub artwork_url: Option<String>,
    #[specta(type = Number<i64>)]
    pub ms_played: i64,
    #[specta(type = Number<i64>)]
    pub plays: i64,
}

#[derive(sqlx::FromRow)]
struct TopTrackRow {
    title: String,
    artists: String,
    artwork_url: Option<String>,
    ms_played: i64,
    plays: i64,
}

impl TopTrackRow {
    fn into_track(self) -> Result<TopTrack, String> {
        let artists: Vec<String> = serde_json::from_str(&self.artists).map_err(|err| {
            format!(
                "Failed to parse artists for top track '{}': {err}",
                self.title
            )
        })?;

        Ok(TopTrack {
            title: self.title,
            artists,
            artwork_url: self.artwork_url,
            ms_played: self.ms_played,
            plays: self.plays,
        })
    }
}

impl HistoryDb {
    pub async fn top_artists(
        &self,
        from: i64,
        to: i64,
        limit: i64,
    ) -> Result<Vec<TopArtist>, String> {
        sqlx::query_as::<_, TopArtist>(
            "\
            WITH track_totals AS ( \
                SELECT track_id, SUM(ms_played) AS ms_played, COUNT(*) AS plays \
                FROM play_listening_time \
                WHERE started_at >= ? AND started_at <= ? \
                GROUP BY track_id \
            ), \
            credits AS ( \
                SELECT artist.value AS name, tracks.artwork_url, \
                    track_totals.ms_played, track_totals.plays \
                FROM track_totals \
                JOIN tracks ON tracks.id = track_totals.track_id \
                JOIN json_each(tracks.artists) AS artist \
            ), \
            artwork AS ( \
                SELECT name, artwork_url, MAX(ms_played) \
                FROM credits \
                WHERE artwork_url IS NOT NULL \
                GROUP BY name \
            ) \
            SELECT credits.name AS name, \
                artwork.artwork_url AS artwork_url, \
                SUM(credits.ms_played) AS ms_played, \
                SUM(credits.plays) AS plays \
            FROM credits \
            LEFT JOIN artwork ON artwork.name = credits.name \
            GROUP BY credits.name \
            ORDER BY ms_played DESC, name \
            LIMIT ?",
        )
        .bind(from)
        .bind(to)
        .bind(limit)
        .fetch_all(self.pool())
        .await
        .map_err(|err| format!("Failed to aggregate top artists: {err}"))
    }

    pub async fn top_albums(
        &self,
        from: i64,
        to: i64,
        limit: i64,
    ) -> Result<Vec<TopAlbum>, String> {
        sqlx::query_as::<_, TopAlbum>(
            "\
            WITH track_totals AS ( \
                SELECT track_id, SUM(ms_played) AS ms_played, COUNT(*) AS plays \
                FROM play_listening_time \
                WHERE started_at >= ? AND started_at <= ? \
                GROUP BY track_id \
            ), \
            releases AS ( \
                SELECT tracks.album_title AS title, \
                    json_extract(tracks.artists, '$[0]') AS artist, \
                    tracks.artwork_url, \
                    track_totals.ms_played, \
                    track_totals.plays \
                FROM track_totals \
                JOIN tracks ON tracks.id = track_totals.track_id \
                WHERE tracks.album_title IS NOT NULL \
            ), \
            artwork AS ( \
                SELECT title, artist, artwork_url, MAX(ms_played) \
                FROM releases \
                WHERE artwork_url IS NOT NULL \
                GROUP BY title, artist \
            ) \
            SELECT releases.title AS title, \
                releases.artist AS artist, \
                artwork.artwork_url AS artwork_url, \
                SUM(releases.ms_played) AS ms_played, \
                SUM(releases.plays) AS plays \
            FROM releases \
            LEFT JOIN artwork \
                ON artwork.title = releases.title AND artwork.artist = releases.artist \
            GROUP BY releases.title, releases.artist \
            ORDER BY ms_played DESC, title \
            LIMIT ?",
        )
        .bind(from)
        .bind(to)
        .bind(limit)
        .fetch_all(self.pool())
        .await
        .map_err(|err| format!("Failed to aggregate top albums: {err}"))
    }

    pub async fn top_tracks(
        &self,
        from: i64,
        to: i64,
        limit: i64,
    ) -> Result<Vec<TopTrack>, String> {
        sqlx::query_as::<_, TopTrackRow>(
            "\
            WITH track_totals AS ( \
                SELECT track_id, SUM(ms_played) AS ms_played, COUNT(*) AS plays \
                FROM play_listening_time \
                WHERE started_at >= ? AND started_at <= ? \
                GROUP BY track_id \
            ) \
            SELECT tracks.title AS title, \
                tracks.artists AS artists, \
                tracks.artwork_url AS artwork_url, \
                track_totals.ms_played AS ms_played, \
                track_totals.plays AS plays \
            FROM track_totals \
            JOIN tracks ON tracks.id = track_totals.track_id \
            ORDER BY ms_played DESC, title \
            LIMIT ?",
        )
        .bind(from)
        .bind(to)
        .bind(limit)
        .fetch_all(self.pool())
        .await
        .map_err(|err| format!("Failed to aggregate top tracks: {err}"))?
        .into_iter()
        .map(TopTrackRow::into_track)
        .collect()
    }
}

#[cfg(test)]
#[path = "top_lists.test.rs"]
mod tests;

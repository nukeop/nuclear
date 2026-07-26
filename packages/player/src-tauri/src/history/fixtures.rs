use std::sync::atomic::{AtomicU32, Ordering};

use chrono::{Local, TimeZone};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};

use crate::history::types::{PlayEvent, PlayEventKind, TrackSnapshot};
use crate::history::HistoryDb;

static DB_COUNTER: AtomicU32 = AtomicU32::new(0);

pub async fn pool() -> SqlitePool {
    let id = DB_COUNTER.fetch_add(1, Ordering::Relaxed);
    let options: SqliteConnectOptions = format!("sqlite:file:testdb_{id}?mode=memory&cache=shared")
        .parse()
        .unwrap();
    let options = crate::db::configure(options);

    let pool = SqlitePool::connect_with(options).await.unwrap();
    sqlx::migrate!("./migrations/history")
        .run(&pool)
        .await
        .unwrap();

    pool
}

pub struct TrackSnapshotBuilder(TrackSnapshot);

impl TrackSnapshotBuilder {
    pub fn new(title: &str) -> Self {
        Self(TrackSnapshot {
            title: title.into(),
            artists: vec!["Test Artist".into()],
            album_title: None,
            duration_ms: None,
            artwork_url: None,
            provider: "test".into(),
            provider_id: title.to_lowercase(),
        })
    }

    pub fn artists(mut self, artists: &[&str]) -> Self {
        self.0.artists = artists.iter().map(ToString::to_string).collect();
        self
    }

    pub fn album(mut self, album_title: &str) -> Self {
        self.0.album_title = Some(album_title.into());
        self
    }

    pub fn artwork(mut self, artwork_url: &str) -> Self {
        self.0.artwork_url = Some(artwork_url.into());
        self
    }

    pub fn duration(mut self, duration_ms: i64) -> Self {
        self.0.duration_ms = Some(duration_ms);
        self
    }

    pub fn provider(mut self, provider: &str, provider_id: &str) -> Self {
        self.0.provider = provider.into();
        self.0.provider_id = provider_id.into();
        self
    }

    pub fn build(self) -> TrackSnapshot {
        self.0
    }
}

pub fn track_snapshot(title: &str) -> TrackSnapshot {
    TrackSnapshotBuilder::new(title).build()
}

pub fn local_time(hour: u32) -> i64 {
    Local
        .with_ymd_and_hms(2026, 7, 15, hour, 0, 0)
        .unwrap()
        .timestamp_millis()
}

pub fn local_date(day: u32) -> i64 {
    Local
        .with_ymd_and_hms(2026, 7, day, 12, 0, 0)
        .unwrap()
        .timestamp_millis()
}

pub async fn seed_events_for(
    db: &HistoryDb,
    play_id: &str,
    snapshot: &TrackSnapshot,
    events: &[(PlayEventKind, i64, i64)],
) {
    for (index, (kind, at, position_ms)) in events.iter().enumerate() {
        db.record_event(PlayEvent {
            play_id: play_id.into(),
            kind: *kind,
            at: *at,
            position_ms: *position_ms,
            seek_to_ms: None,
            snapshot: (index == 0).then(|| snapshot.clone()),
        })
        .await
        .unwrap();
    }
}

pub async fn seed_events(
    db: &HistoryDb,
    play_id: &str,
    title: &str,
    events: &[(PlayEventKind, i64)],
) {
    let positioned: Vec<(PlayEventKind, i64, i64)> =
        events.iter().map(|(kind, at)| (*kind, *at, 0)).collect();
    seed_events_for(db, play_id, &track_snapshot(title), &positioned).await;
}

pub async fn seed_started(db: &HistoryDb, play_id: &str, title: &str, at: i64) {
    seed_events(db, play_id, title, &[(PlayEventKind::Started, at)]).await;
}

pub async fn seed_play(
    db: &HistoryDb,
    play_id: &str,
    track: &TrackSnapshot,
    started_at: i64,
    ms_played: i64,
) {
    seed_events_for(
        db,
        play_id,
        track,
        &[
            (PlayEventKind::Started, started_at, 0),
            (PlayEventKind::Finished, started_at + ms_played, ms_played),
        ],
    )
    .await;
}

pub async fn seed_finished_play(db: &HistoryDb, play_id: &str, title: &str, at: i64) {
    seed_play(db, play_id, &track_snapshot(title), at, 1000).await;
}

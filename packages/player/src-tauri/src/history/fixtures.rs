use std::sync::atomic::{AtomicU32, Ordering};

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

pub fn track_snapshot(title: &str) -> TrackSnapshot {
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

pub async fn seed_events(
    db: &HistoryDb,
    play_id: &str,
    title: &str,
    events: &[(PlayEventKind, i64)],
) {
    for (index, (kind, at)) in events.iter().enumerate() {
        db.record_event(PlayEvent {
            play_id: play_id.into(),
            kind: *kind,
            at: *at,
            position_ms: 0,
            seek_to_ms: None,
            snapshot: (index == 0).then(|| track_snapshot(title)),
        })
        .await
        .unwrap();
    }
}

pub async fn seed_started(db: &HistoryDb, play_id: &str, title: &str, at: i64) {
    seed_events(db, play_id, title, &[(PlayEventKind::Started, at)]).await;
}

pub async fn seed_finished_play(db: &HistoryDb, play_id: &str, title: &str, at: i64) {
    seed_events(
        db,
        play_id,
        title,
        &[
            (PlayEventKind::Started, at),
            (PlayEventKind::Finished, at + 1000),
        ],
    )
    .await;
}

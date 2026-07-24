use chrono::{Local, TimeZone};

use super::DailyListeningTime;
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

fn local_date(day: u32) -> i64 {
    Local
        .with_ymd_and_hms(2026, 7, day, 12, 0, 0)
        .unwrap()
        .timestamp_millis()
}

fn daily(date: &str, value: i64) -> DailyListeningTime {
    DailyListeningTime {
        date: date.to_string(),
        value,
    }
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

#[tokio::test]
async fn credits_listening_time_to_the_local_date_a_play_started_on() {
    let db = HistoryDb(fixtures::pool().await);
    seed_play(&db, "play-1", local_date(15), 90_000).await;

    let stats = db.daily_listening_time(0, i64::MAX).await.unwrap();

    assert_eq!(stats, vec![daily("2026-07-15", 90_000)]);
}

#[tokio::test]
async fn accumulates_listening_time_from_multiple_plays_on_the_same_date() {
    let db = HistoryDb(fixtures::pool().await);
    let start = local_date(15);
    seed_play(&db, "play-1", start, 30_000).await;
    seed_play(&db, "play-2", start + 60_000, 45_000).await;

    let stats = db.daily_listening_time(0, i64::MAX).await.unwrap();

    assert_eq!(stats, vec![daily("2026-07-15", 75_000)]);
}

#[tokio::test]
async fn returns_dates_in_ascending_order() {
    let db = HistoryDb(fixtures::pool().await);
    seed_play(&db, "play-later", local_date(16), 30_000).await;
    seed_play(&db, "play-earlier", local_date(14), 60_000).await;

    let stats = db.daily_listening_time(0, i64::MAX).await.unwrap();

    assert_eq!(
        stats,
        vec![daily("2026-07-14", 60_000), daily("2026-07-16", 30_000)]
    );
}

#[tokio::test]
async fn excludes_paused_time_from_the_daily_total() {
    let db = HistoryDb(fixtures::pool().await);
    let start = local_date(15);
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

    let stats = db.daily_listening_time(0, i64::MAX).await.unwrap();

    assert_eq!(stats, vec![daily("2026-07-15", 5_000)]);
}

#[tokio::test]
async fn excludes_days_outside_the_requested_range() {
    let db = HistoryDb(fixtures::pool().await);
    seed_play(&db, "play-before", local_date(10), 60_000).await;
    seed_play(&db, "play-inside", local_date(15), 90_000).await;
    seed_play(&db, "play-after", local_date(20), 30_000).await;

    let stats = db
        .daily_listening_time(local_date(14), local_date(16))
        .await
        .unwrap();

    assert_eq!(stats, vec![daily("2026-07-15", 90_000)]);
}

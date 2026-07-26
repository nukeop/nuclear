use crate::history::fixtures;
use crate::history::fixtures::{local_date, seed_play, TrackSnapshotBuilder};
use crate::history::HistoryDb;

#[tokio::test]
async fn sums_listening_time_across_every_track_by_an_artist() {
    let db = HistoryDb(fixtures::pool().await);
    let believer = TrackSnapshotBuilder::new("Believer")
        .artists(&["John Maus"])
        .build();
    let cop_killer = TrackSnapshotBuilder::new("Cop Killer")
        .artists(&["John Maus"])
        .build();
    seed_play(&db, "play-1", &believer, local_date(1), 90_000).await;
    seed_play(&db, "play-2", &cop_killer, local_date(2), 60_000).await;

    let artists = db.top_artists(0, i64::MAX, 10).await.unwrap();

    assert_eq!(artists.len(), 1);
    assert_eq!(artists[0].name, "John Maus");
    assert_eq!(artists[0].ms_played, 150_000);
}

#[tokio::test]
async fn credits_a_collaboration_to_every_artist_on_it() {
    let db = HistoryDb(fixtures::pool().await);
    let duet = TrackSnapshotBuilder::new("Fright Night")
        .artists(&["Ariel Pink", "Devin Lynn"])
        .build();
    seed_play(&db, "play-1", &duet, local_date(1), 120_000).await;

    let artists = db.top_artists(0, i64::MAX, 10).await.unwrap();

    assert_eq!(artists.len(), 2);
    assert_eq!(artists[0].ms_played, 120_000);
    assert_eq!(artists[1].ms_played, 120_000);
}

#[tokio::test]
async fn orders_artists_by_listening_time_and_honours_the_limit() {
    let db = HistoryDb(fixtures::pool().await);
    let maus = TrackSnapshotBuilder::new("Believer")
        .artists(&["John Maus"])
        .build();
    let pink = TrackSnapshotBuilder::new("Round and Round")
        .artists(&["Ariel Pink"])
        .build();
    let swans = TrackSnapshotBuilder::new("The Seer")
        .artists(&["Swans"])
        .build();
    seed_play(&db, "play-1", &maus, local_date(1), 30_000).await;
    seed_play(&db, "play-2", &pink, local_date(2), 90_000).await;
    seed_play(&db, "play-3", &swans, local_date(3), 60_000).await;

    let artists = db.top_artists(0, i64::MAX, 2).await.unwrap();

    assert_eq!(artists.len(), 2);
    assert_eq!(artists[0].name, "Ariel Pink");
    assert_eq!(artists[1].name, "Swans");
}

#[tokio::test]
async fn takes_artwork_from_the_artists_most_played_track() {
    let db = HistoryDb(fixtures::pool().await);
    let believer = TrackSnapshotBuilder::new("Believer")
        .artists(&["John Maus"])
        .artwork("believer.jpg")
        .build();
    let cop_killer = TrackSnapshotBuilder::new("Cop Killer")
        .artists(&["John Maus"])
        .artwork("cop-killer.jpg")
        .build();
    seed_play(&db, "play-1", &believer, local_date(1), 30_000).await;
    seed_play(&db, "play-2", &cop_killer, local_date(2), 90_000).await;

    let artists = db.top_artists(0, i64::MAX, 10).await.unwrap();

    assert_eq!(artists[0].artwork_url.as_deref(), Some("cop-killer.jpg"));
}

#[tokio::test]
async fn leaves_artwork_empty_when_no_track_by_the_artist_has_any() {
    let db = HistoryDb(fixtures::pool().await);
    let believer = TrackSnapshotBuilder::new("Believer")
        .artists(&["John Maus"])
        .build();
    seed_play(&db, "play-1", &believer, local_date(1), 30_000).await;

    let artists = db.top_artists(0, i64::MAX, 10).await.unwrap();

    assert_eq!(artists[0].artwork_url, None);
}

#[tokio::test]
async fn counts_only_plays_that_started_inside_the_range() {
    let db = HistoryDb(fixtures::pool().await);
    let believer = TrackSnapshotBuilder::new("Believer")
        .artists(&["John Maus"])
        .build();
    seed_play(&db, "play-1", &believer, local_date(1), 30_000).await;
    seed_play(&db, "play-2", &believer, local_date(20), 90_000).await;

    let artists = db
        .top_artists(local_date(15), local_date(25), 10)
        .await
        .unwrap();

    assert_eq!(artists[0].ms_played, 90_000);
}

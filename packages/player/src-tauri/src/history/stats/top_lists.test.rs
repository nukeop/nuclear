use super::TopAlbum;
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

#[tokio::test]
async fn sums_listening_time_across_every_track_on_an_album() {
    let db = HistoryDb(fixtures::pool().await);
    let opener = TrackSnapshotBuilder::new("Lust for Life")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .build();
    let closer = TrackSnapshotBuilder::new("The Passenger")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .build();
    seed_play(&db, "play-1", &opener, local_date(1), 90_000).await;
    seed_play(&db, "play-2", &closer, local_date(2), 60_000).await;

    let albums = db.top_albums(0, i64::MAX, 10).await.unwrap();

    assert_eq!(
        albums,
        vec![TopAlbum {
            title: "Lust for Life".to_string(),
            artist: "Iggy Pop".to_string(),
            artwork_url: None,
            ms_played: 150_000,
        }]
    );
}

#[tokio::test]
async fn keeps_albums_with_the_same_title_by_different_artists_apart() {
    let db = HistoryDb(fixtures::pool().await);
    let iggy = TrackSnapshotBuilder::new("The Passenger")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .build();
    let girls = TrackSnapshotBuilder::new("Hercules")
        .artists(&["Girls"])
        .album("Lust for Life")
        .build();
    seed_play(&db, "play-1", &iggy, local_date(1), 90_000).await;
    seed_play(&db, "play-2", &girls, local_date(2), 60_000).await;

    let albums = db.top_albums(0, i64::MAX, 10).await.unwrap();

    assert_eq!(
        albums,
        vec![
            TopAlbum {
                title: "Lust for Life".to_string(),
                artist: "Iggy Pop".to_string(),
                artwork_url: None,
                ms_played: 90_000,
            },
            TopAlbum {
                title: "Lust for Life".to_string(),
                artist: "Girls".to_string(),
                artwork_url: None,
                ms_played: 60_000,
            },
        ]
    );
}

#[tokio::test]
async fn skips_tracks_that_belong_to_no_album() {
    let db = HistoryDb(fixtures::pool().await);
    let single = TrackSnapshotBuilder::new("Sister Midnight")
        .artists(&["Iggy Pop"])
        .build();
    let album_track = TrackSnapshotBuilder::new("The Passenger")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .build();
    seed_play(&db, "play-1", &single, local_date(1), 90_000).await;
    seed_play(&db, "play-2", &album_track, local_date(2), 60_000).await;

    let albums = db.top_albums(0, i64::MAX, 10).await.unwrap();

    assert_eq!(
        albums,
        vec![TopAlbum {
            title: "Lust for Life".to_string(),
            artist: "Iggy Pop".to_string(),
            artwork_url: None,
            ms_played: 60_000,
        }]
    );
}

#[tokio::test]
async fn orders_albums_by_listening_time_and_respects_the_limit() {
    let db = HistoryDb(fixtures::pool().await);
    let lust = TrackSnapshotBuilder::new("The Passenger")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .build();
    let idiot = TrackSnapshotBuilder::new("Nightclubbing")
        .artists(&["Iggy Pop"])
        .album("The Idiot")
        .build();
    let fun_house = TrackSnapshotBuilder::new("Down on the Street")
        .artists(&["The Stooges"])
        .album("Fun House")
        .build();
    seed_play(&db, "play-1", &lust, local_date(1), 30_000).await;
    seed_play(&db, "play-2", &idiot, local_date(2), 90_000).await;
    seed_play(&db, "play-3", &fun_house, local_date(3), 60_000).await;

    let albums = db.top_albums(0, i64::MAX, 2).await.unwrap();

    assert_eq!(
        albums,
        vec![
            TopAlbum {
                title: "The Idiot".to_string(),
                artist: "Iggy Pop".to_string(),
                artwork_url: None,
                ms_played: 90_000,
            },
            TopAlbum {
                title: "Fun House".to_string(),
                artist: "The Stooges".to_string(),
                artwork_url: None,
                ms_played: 60_000,
            },
        ]
    );
}

#[tokio::test]
async fn takes_artwork_from_the_albums_most_played_track() {
    let db = HistoryDb(fixtures::pool().await);
    let opener = TrackSnapshotBuilder::new("Lust for Life")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .artwork("opener.jpg")
        .build();
    let closer = TrackSnapshotBuilder::new("The Passenger")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .artwork("closer.jpg")
        .build();
    seed_play(&db, "play-1", &opener, local_date(1), 30_000).await;
    seed_play(&db, "play-2", &closer, local_date(2), 90_000).await;

    let albums = db.top_albums(0, i64::MAX, 10).await.unwrap();

    assert_eq!(
        albums,
        vec![TopAlbum {
            title: "Lust for Life".to_string(),
            artist: "Iggy Pop".to_string(),
            artwork_url: Some("closer.jpg".to_string()),
            ms_played: 120_000,
        }]
    );
}

#[tokio::test]
async fn counts_only_album_plays_that_started_inside_the_range() {
    let db = HistoryDb(fixtures::pool().await);
    let passenger = TrackSnapshotBuilder::new("The Passenger")
        .artists(&["Iggy Pop"])
        .album("Lust for Life")
        .build();
    seed_play(&db, "play-1", &passenger, local_date(1), 30_000).await;
    seed_play(&db, "play-2", &passenger, local_date(20), 90_000).await;

    let albums = db
        .top_albums(local_date(15), local_date(25), 10)
        .await
        .unwrap();

    assert_eq!(
        albums,
        vec![TopAlbum {
            title: "Lust for Life".to_string(),
            artist: "Iggy Pop".to_string(),
            artwork_url: None,
            ms_played: 90_000,
        }]
    );
}

mod now_playing;
mod platform;

use std::error::Error;

use serde::de::DeserializeOwned;
use serde_json::json;
use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, OsMediaControls};
use tauri::{AppHandle, Manager};
use tokio::sync::broadcast::error::RecvError;

use crate::bridge::bridge::Bridge;
use now_playing::{PlaybackState, QueueItem};

type Result<T> = std::result::Result<T, Box<dyn Error + Send + Sync>>;

pub fn init_media_controls(app_handle: AppHandle) {
    let bridge = app_handle.state::<Bridge>().inner().clone();
    match MediaSession::new(&app_handle, bridge) {
        Ok(session) => {
            tauri::async_runtime::spawn(session.run());
        }
        Err(error) => log::warn!(target: "media_controls", "Media controls unavailable: {error}"),
    }
}

struct MediaSession {
    controls: OsMediaControls,
    bridge: Bridge,
}

impl MediaSession {
    fn new(app_handle: &AppHandle, bridge: Bridge) -> Result<Self> {
        let mut controls = OsMediaControls::new(platform::config(app_handle)?)?;
        controls.attach(
            |event: MediaControlEvent| log::debug!(target: "media_controls", "{event:?}"),
        )?;
        Ok(Self { controls, bridge })
    }

    async fn run(mut self) {
        let mut notifications = self.bridge.subscribe_notifications();
        loop {
            match notifications.recv().await {
                Ok(notification) if notification.subsystem == "player" => {
                    if let Err(error) = self.update().await {
                        log::warn!(target: "media_controls", "Update failed: {error}");
                    }
                }
                Ok(_) | Err(RecvError::Lagged(_)) => {}
                Err(RecvError::Closed) => break,
            }
        }
    }

    async fn update(&mut self) -> Result<()> {
        let item: Option<QueueItem> = self.fetch("Queue.getCurrentItem").await?;
        let state: PlaybackState = self.fetch("Playback.getState").await?;
        let track = item.map(|item| item.track);

        let metadata = track.as_ref().map(MediaMetadata::from).unwrap_or_default();
        self.controls.set_metadata(metadata)?;
        self.controls.set_cover(
            track
                .and_then(|track| track.cover_url())
                .map(platform::cover),
        )?;
        self.controls.set_playback(state.into())?;
        Ok(())
    }

    async fn fetch<T: DeserializeOwned>(&self, method: &str) -> Result<T> {
        let value = self
            .bridge
            .call(method, json!({}))
            .await
            .map_err(|error| error.to_string())?;
        Ok(serde_json::from_value(value)?)
    }
}

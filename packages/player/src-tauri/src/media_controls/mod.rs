mod events;
mod now_playing;
mod platform;
mod repeat;

use std::error::Error;

use serde::de::DeserializeOwned;
use serde_json::json;
use souvlaki::{MediaControls, MediaMetadata, OsMediaControls};
use tauri::{AppHandle, Manager};
use tokio::sync::broadcast::error::RecvError;

use crate::bridge::bridge::Bridge;
use now_playing::{PlaybackState, QueueItem, Track};
use repeat::RepeatMode;

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
    current_item_id: Option<String>,
}

impl MediaSession {
    fn new(app_handle: &AppHandle, bridge: Bridge) -> Result<Self> {
        let mut controls = OsMediaControls::new(platform::config(app_handle)?)?;
        controls.attach(events::handler(bridge.clone()))?;
        controls.set_permissions(platform::permissions())?;
        Ok(Self {
            controls,
            bridge,
            current_item_id: None,
        })
    }

    async fn run(mut self) {
        let mut notifications = self.bridge.subscribe_notifications();
        loop {
            match notifications.recv().await {
                Ok(notification) => {
                    if let Err(error) = self.update(&notification.subsystem).await {
                        log::warn!(target: "media_controls", "Update failed: {error}");
                    }
                }
                Err(RecvError::Lagged(_)) => {}
                Err(RecvError::Closed) => break,
            }
        }
    }

    async fn update(&mut self, subsystem: &str) -> Result<()> {
        match subsystem {
            "player" => self.update_now_playing().await,
            "options" => self.update_options().await,
            "mixer" => self.update_volume().await,
            _ => Ok(()),
        }
    }

    async fn update_options(&mut self) -> Result<()> {
        let mode: RepeatMode = self.fetch("Playback.getRepeatMode").await?;
        let shuffle: bool = self.fetch("Playback.isShuffleEnabled").await?;
        self.controls.set_repeat(mode.into())?;
        self.controls.set_shuffle(shuffle)?;
        Ok(())
    }

    async fn update_volume(&mut self) -> Result<()> {
        let volume: f64 = self.fetch("Playback.getVolume").await?;
        self.controls.set_volume(volume)?;
        Ok(())
    }

    async fn update_now_playing(&mut self) -> Result<()> {
        let item: Option<QueueItem> = self.fetch("Queue.getCurrentItem").await?;
        let state: PlaybackState = self.fetch("Playback.getState").await?;

        let item_id = item.as_ref().map(|item| item.id.clone());
        if item_id != self.current_item_id {
            self.update_track(item.map(|item| item.track))?;
            self.current_item_id = item_id;
        }
        self.controls.set_playback(state.into())?;
        Ok(())
    }

    fn update_track(&mut self, track: Option<Track>) -> Result<()> {
        let metadata = track.as_ref().map(MediaMetadata::from).unwrap_or_default();
        self.controls.set_metadata(metadata)?;
        platform::set_cover(
            &mut self.controls,
            track.and_then(|track| track.cover_url()),
        )?;
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

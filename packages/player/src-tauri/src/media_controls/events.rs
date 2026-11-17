use serde_json::{json, Value};
use souvlaki::{MediaControlEvent, MediaPosition};

use super::repeat::RepeatMode;
use crate::bridge::bridge::Bridge;

pub fn handler(bridge: Bridge) -> impl Fn(MediaControlEvent) + Send + 'static {
    move |event| {
        let Some((method, params)) = bridge_call(&event) else {
            log::debug!(target: "media_controls", "Unhandled event: {event:?}");
            return;
        };

        let bridge = bridge.clone();
        tauri::async_runtime::spawn(async move {
            if let Err(error) = bridge.call(method, params).await {
                log::warn!(target: "media_controls", "{method} failed: {error}");
            }
        });
    }
}

fn bridge_call(event: &MediaControlEvent) -> Option<(&'static str, Value)> {
    match event {
        MediaControlEvent::Play => Some(("Playback.play", json!({}))),
        MediaControlEvent::Pause => Some(("Playback.pause", json!({}))),
        MediaControlEvent::Toggle => Some(("Playback.toggle", json!({}))),
        MediaControlEvent::Stop => Some(("Playback.stop", json!({}))),
        MediaControlEvent::Next => Some(("Queue.goToNext", json!({}))),
        MediaControlEvent::Previous => Some(("Queue.goToPrevious", json!({}))),
        MediaControlEvent::SetPosition(MediaPosition(position)) => Some((
            "Playback.seekTo",
            json!({ "seconds": position.as_secs_f64() }),
        )),
        MediaControlEvent::SetRepeat(repeat) => Some((
            "Playback.setRepeatMode",
            json!({ "mode": RepeatMode::from(*repeat) }),
        )),
        _ => None,
    }
}

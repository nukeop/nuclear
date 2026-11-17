use serde_json::json;
use souvlaki::MediaControlEvent;

use crate::bridge::bridge::Bridge;

pub fn handler(bridge: Bridge) -> impl Fn(MediaControlEvent) + Send + 'static {
    move |event| {
        let Some(method) = bridge_method(&event) else {
            log::debug!(target: "media_controls", "Unhandled event: {event:?}");
            return;
        };

        let bridge = bridge.clone();
        tauri::async_runtime::spawn(async move {
            if let Err(error) = bridge.call(method, json!({})).await {
                log::warn!(target: "media_controls", "{method} failed: {error}");
            }
        });
    }
}

fn bridge_method(event: &MediaControlEvent) -> Option<&'static str> {
    match event {
        MediaControlEvent::Play => Some("Playback.play"),
        MediaControlEvent::Pause => Some("Playback.pause"),
        MediaControlEvent::Toggle => Some("Playback.toggle"),
        MediaControlEvent::Stop => Some("Playback.stop"),
        MediaControlEvent::Next => Some("Queue.goToNext"),
        MediaControlEvent::Previous => Some("Queue.goToPrevious"),
        _ => None,
    }
}

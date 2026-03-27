use std::sync::Mutex;

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use serde::Deserialize;
use tauri::{command, Manager, State};

const DISCORD_APP_ID: &str = "1038970224050962582";

pub struct DiscordState {
    pub client: Mutex<Option<DiscordIpcClient>>,
}

pub fn init_discord(app_handle: tauri::AppHandle) {
    app_handle.manage(DiscordState {
        client: Mutex::new(None),
    });
}

#[command]
pub fn discord_connect(state: State<'_, DiscordState>) -> Result<(), String> {
    let mut client_guard = state.client.lock().map_err(|err| err.to_string())?;

    if client_guard.is_some() {
        return Ok(());
    }

    let mut client = DiscordIpcClient::new(DISCORD_APP_ID);
    client.connect().map_err(|err| err.to_string())?;

    *client_guard = Some(client);
    Ok(())
}

#[command]
pub fn discord_disconnect(state: State<'_, DiscordState>) -> Result<(), String> {
    let mut client_guard = state.client.lock().map_err(|err| err.to_string())?;

    if let Some(mut client) = client_guard.take() {
        let _ = client.close();
    }

    Ok(())
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrackPresence {
    title: String,
    artist: String,
    album: Option<String>,
    artwork_url: Option<String>,
    start_timestamp: Option<i64>,
    end_timestamp: Option<i64>,
}

#[command]
pub fn discord_set_activity(
    state: State<'_, DiscordState>,
    track: TrackPresence,
) -> Result<(), String> {
    let mut client_guard = state.client.lock().map_err(|err| err.to_string())?;
    let client = client_guard.as_mut().ok_or("Discord not connected")?;

    let mut payload = activity::Activity::new()
        .activity_type(activity::ActivityType::Listening)
        .details(&track.title)
        .state(&track.artist);

    let mut assets = activity::Assets::new();
    if let Some(ref url) = track.artwork_url {
        assets = assets.large_image(url);
    }
    if let Some(ref album) = track.album {
        assets = assets.large_text(album);
    }
    payload = payload.assets(assets);

    let mut timestamps = activity::Timestamps::new();
    if let Some(start) = track.start_timestamp {
        timestamps = timestamps.start(start);
    }
    if let Some(end) = track.end_timestamp {
        timestamps = timestamps.end(end);
    }
    payload = payload.timestamps(timestamps);

    client
        .set_activity(payload)
        .map_err(|err| err.to_string())?;

    Ok(())
}

#[command]
pub fn discord_clear_activity(state: State<'_, DiscordState>) -> Result<(), String> {
    let mut client_guard = state.client.lock().map_err(|err| err.to_string())?;
    let client = client_guard.as_mut().ok_or("Discord not connected")?;

    client.clear_activity().map_err(|err| err.to_string())?;

    Ok(())
}

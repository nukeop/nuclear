use std::sync::Mutex;

use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
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

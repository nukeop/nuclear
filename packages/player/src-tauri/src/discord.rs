use std::sync::Mutex;

use discord_rich_presence::DiscordIpcClient;
use tauri::Manager;

const DISCORD_APP_ID: &str = "1038970224050962582";

pub struct DiscordState {
    pub client: Mutex<Option<DiscordIpcClient>>,
}

pub fn init_discord(app_handle: tauri::AppHandle) {
    app_handle.manage(DiscordState {
        client: Mutex::new(None),
    });
}

use std::sync::Mutex;

use discord_rich_presence::DiscordIpcClient;
use tauri::Manager;

pub struct DiscordState {
    pub client: Mutex<Option<DiscordIpcClient>>,
}

pub fn init_discord(app_handle: tauri::AppHandle) {
    app_handle.manage(DiscordState {
        client: Mutex::new(None),
    });
}

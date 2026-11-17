use souvlaki::platform::mpris::{MprisConfig, MprisCover};
use tauri::AppHandle;

pub fn config(_app_handle: &AppHandle) -> Result<MprisConfig, String> {
    Ok(MprisConfig {
        dbus_name: "nuclear".to_string(),
        identity: "Nuclear".to_string(),
        desktop_entry: "com.nuclearplayer.Nuclear".to_string(),
    })
}

pub fn cover(url: String) -> MprisCover {
    MprisCover::Url(url)
}

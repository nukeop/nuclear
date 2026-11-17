use souvlaki::platform::mpris::{MprisConfig, MprisCover, MprisPermissions};
use souvlaki::platform::OsError;
use souvlaki::{MediaControls, OsMediaControls};
use tauri::AppHandle;

pub fn config(_app_handle: &AppHandle) -> Result<MprisConfig, String> {
    Ok(MprisConfig {
        dbus_name: "nuclear".to_string(),
        identity: "Nuclear".to_string(),
        desktop_entry: "com.nuclearplayer.Nuclear".to_string(),
    })
}

pub fn permissions() -> MprisPermissions {
    MprisPermissions {
        can_go_next: true,
        can_go_previous: true,
        can_play: true,
        can_pause: true,
        can_seek: true,
        can_control: true,
        ..MprisPermissions::none()
    }
}

pub fn set_cover(controls: &mut OsMediaControls, url: Option<String>) -> Result<(), OsError> {
    controls.set_cover(url.map(MprisCover::Url))
}

use souvlaki::platform::apple::{AppleCover, ApplePermissions};
use souvlaki::platform::OsError;
use souvlaki::{MediaControls, OsMediaControls};
use tauri::AppHandle;

pub fn config(_app_handle: &AppHandle) -> Result<(), String> {
    Ok(())
}

pub fn permissions() -> ApplePermissions {
    ApplePermissions {
        toggle_play_pause: true,
        play: true,
        pause: true,
        stop: true,
        previous_track: true,
        next_track: true,
        change_repeat_mode: false,
        change_shuffle_mode: false,
        change_playback_rate: false,
        seek_backward: false,
        seek_forward: false,
        skip_backward: false,
        skip_forward: false,
        change_playback_position: false,
    }
}

pub fn set_cover(controls: &mut OsMediaControls, url: Option<String>) -> Result<(), OsError> {
    let Some(url) = url else {
        return Ok(());
    };
    controls.set_cover(Some(AppleCover::Url(url)))
}

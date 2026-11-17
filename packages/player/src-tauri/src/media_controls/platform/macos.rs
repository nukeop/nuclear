use souvlaki::platform::apple::AppleCover;
use souvlaki::platform::OsError;
use souvlaki::{MediaControls, OsMediaControls};
use tauri::AppHandle;

pub fn config(_app_handle: &AppHandle) -> Result<(), String> {
    Ok(())
}

pub fn set_cover(controls: &mut OsMediaControls, url: Option<String>) -> Result<(), OsError> {
    let Some(url) = url else {
        return Ok(());
    };
    controls.set_cover(Some(AppleCover::Url(url)))
}

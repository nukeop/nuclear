use souvlaki::platform::apple::AppleCover;
use tauri::AppHandle;

pub fn config(_app_handle: &AppHandle) -> Result<(), String> {
    Ok(())
}

pub fn cover(url: String) -> AppleCover {
    AppleCover::Url(url)
}

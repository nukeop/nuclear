use souvlaki::platform::windows::{WindowsConfig, WindowsCover};
use souvlaki::platform::OsError;
use souvlaki::{MediaControls, OsMediaControls};
use tauri::{AppHandle, Manager};

pub fn config(app_handle: &AppHandle) -> Result<WindowsConfig, String> {
    let window = app_handle
        .get_webview_window("main")
        .ok_or("main window not found")?;
    let hwnd = window.hwnd().map_err(|error| error.to_string())?;
    Ok(WindowsConfig { hwnd: hwnd.0 })
}

pub fn set_cover(controls: &mut OsMediaControls, url: Option<String>) -> Result<(), OsError> {
    let Some(url) = url else {
        return Ok(());
    };
    controls.set_cover(Some(WindowsCover::Uri(url)))
}

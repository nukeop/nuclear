use souvlaki::platform::windows::{WindowsConfig, WindowsCover};
use tauri::{AppHandle, Manager};

pub fn config(app_handle: &AppHandle) -> Result<WindowsConfig, String> {
    let window = app_handle
        .get_webview_window("main")
        .ok_or("main window not found")?;
    let hwnd = window.hwnd().map_err(|error| error.to_string())?;
    Ok(WindowsConfig { hwnd: hwnd.0 })
}

pub fn cover(url: String) -> WindowsCover {
    WindowsCover::Uri(url)
}

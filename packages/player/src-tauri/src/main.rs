// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    let _ = fix_path_env::fix_all_vars();

    #[cfg(target_os = "linux")]
    apply_linux_workarounds();

    app_lib::run();
}

#[cfg(target_os = "linux")]
fn apply_linux_workarounds() {
    // Fix for WebKitGTK GPU rendering failures on various Linux systems including
    // Steam Deck, NVIDIA GPUs, and W**land compositors.
    //
    // WEBKIT_DISABLE_DMABUF_RENDERER: Fixes "Could not create default EGL display:
    // EGL_BAD_PARAMETER" and blank screens on NVIDIA.
    // See: https://github.com/tauri-apps/tauri/issues/9394
    //
    // WEBKIT_DISABLE_COMPOSITING_MODE: Fixes "Failed to get GBM device" errors
    // and crashes on resize with NVIDIA/Steam Deck.
    // See: https://github.com/tauri-apps/tauri/issues/11994
    if std::env::var("WEBKIT_DISABLE_DMABUF_RENDERER").is_err() {
        unsafe {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }
    if std::env::var("WEBKIT_DISABLE_COMPOSITING_MODE").is_err() {
        unsafe {
            std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
        }
    }
}

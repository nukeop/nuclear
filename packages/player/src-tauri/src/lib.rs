pub mod commands;
pub mod discord;
pub mod http;
pub mod logging;
pub mod mcp;
mod setup;
pub mod stream_server;
pub mod ytdlp;
pub mod ytdlp_setup;

// Maximizes the window when running as a non-steam app in steam
#[cfg(target_os = "linux")]
fn maximize_for_gamescope(app: &tauri::App) {
    use tauri::Manager;

    let is_gamescope = std::env::var("GAMESCOPE_WAYLAND_DISPLAY").is_ok()
        || std::env::var("SteamDeck").map_or(false, |v| v == "1");

    if is_gamescope {
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.maximize();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let is_flatpak = std::env::var("FLATPAK_ID").is_ok();

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_upload::init())
        .plugin(setup::log_plugin());

    if !is_flatpak {
        builder = builder
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_process::init());
    }

    builder
        .invoke_handler(tauri::generate_handler![
            commands::is_flatpak,
            commands::copy_dir_recursive,
            commands::extract_zip,
            commands::download_file,
            http::http_fetch,
            ytdlp::ytdlp_search,
            ytdlp::ytdlp_get_stream,
            ytdlp::ytdlp_get_playlist,
            logging::get_startup_logs,
            mcp::mcp_start,
            mcp::mcp_stop,
            mcp::mcp_respond,
            stream_server::stream_server_port,
            ytdlp_setup::ytdlp_ensure_installed,
            discord::discord_connect,
            discord::discord_disconnect
        ])
        .setup(|app| {
            logging::mark_startup_complete();
            mcp::init_mcp(app.handle().clone());
            stream_server::init_stream_server(app.handle().clone());
            discord::init_discord(app.handle().clone());

            #[cfg(target_os = "linux")]
            maximize_for_gamescope(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

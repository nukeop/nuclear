pub mod bridge;
pub mod commands;
pub mod db;
pub mod discord;
pub mod history;
pub mod http;
pub mod http_api;
pub mod logging;
pub mod mcp;
pub mod mpd;
pub mod net;
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

fn typescript_export_config() -> specta_typescript::Typescript {
    specta_typescript::Typescript::default().header("/* eslint-disable */")
}

fn specta_builder() -> tauri_specta::Builder<tauri::Wry> {
    tauri_specta::Builder::<tauri::Wry>::new().commands(
        tauri_specta::collect_commands![
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
            http_api::http_api_start,
            http_api::http_api_stop,
            mpd::mpd_start,
            mpd::mpd_stop,
            stream_server::stream_server_port,
            ytdlp_setup::ytdlp_ensure_installed,
            discord::discord_connect,
            discord::discord_disconnect,
            discord::discord_set_activity,
            discord::discord_clear_activity,
            bridge::bridge_respond,
            bridge::bridge_notify,
            history::history_record_event
        ],
    )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let is_flatpak = std::env::var("FLATPAK_ID").is_ok();

    let specta_builder = specta_builder();

    #[cfg(debug_assertions)]
    specta_builder
        .export(
            typescript_export_config(),
            concat!(
                env!("CARGO_MANIFEST_DIR"),
                "/../src/services/tauri/bindings.ts"
            ),
        )
        .expect("failed to export typescript bindings");

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(setup::log_plugin());

    if !is_flatpak {
        builder = builder
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_process::init());
    }

    builder
        .invoke_handler(specta_builder.invoke_handler())
        .setup(|app| {
            logging::mark_startup_complete();
            bridge::init_bridge(app.handle().clone());
            mcp::init_mcp(app.handle().clone());
            mpd::init_mpd(app.handle().clone());
            http_api::init_http_api(app.handle().clone());
            stream_server::init_stream_server(app.handle().clone());
            discord::init_discord(app.handle().clone());
            history::init_history(app.handle().clone());

            #[cfg(target_os = "linux")]
            maximize_for_gamescope(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

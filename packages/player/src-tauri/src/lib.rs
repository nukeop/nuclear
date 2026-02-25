pub mod commands;
pub mod http;
pub mod logging;
pub mod mcp;
mod setup;
pub mod stream_proxy;
pub mod ytdlp;

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
        builder = builder.plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .register_asynchronous_uri_scheme_protocol("nuclear-stream", |ctx, request, responder| {
            stream_proxy::handle_stream_request(ctx.app_handle(), request, responder);
        })
        .invoke_handler(tauri::generate_handler![
            commands::is_flatpak,
            commands::copy_dir_recursive,
            commands::extract_zip,
            commands::download_file,
            http::http_fetch,
            ytdlp::ytdlp_search,
            ytdlp::ytdlp_get_stream,
            logging::get_startup_logs,
            mcp::mcp_start,
            mcp::mcp_stop,
            mcp::mcp_respond
        ])
        .setup(|app| {
            logging::mark_startup_complete();
            mcp::init_mcp(app.handle().clone());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

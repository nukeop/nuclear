use crate::logging;

const MAX_LOG_FILE_SIZE: u128 = 5_000_000; // 5MB
const MAX_LOG_FILES: usize = 7;

pub fn log_plugin<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri_plugin_log::Builder::default()
        .targets([
            tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
            tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir { file_name: None }),
            tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Webview),
        ])
        .max_file_size(MAX_LOG_FILE_SIZE)
        .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepSome(MAX_LOG_FILES))
        .level(if cfg!(debug_assertions) {
            log::LevelFilter::Debug
        } else {
            log::LevelFilter::Info
        })
        .level_for("discord_rich_presence", log::LevelFilter::Error)
        .format(|callback, message, record| {
            logging::capture_startup_log(record.level(), &message.to_string());
            callback.finish(format_args!(
                "[{}][{}] {}",
                record.level(),
                record.target(),
                message
            ))
        })
        .build()
}

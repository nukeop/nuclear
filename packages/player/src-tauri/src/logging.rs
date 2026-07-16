use std::collections::VecDeque;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

const STARTUP_LOG_BUFFER_SIZE: usize = 100;

static STARTUP_COMPLETE: AtomicBool = AtomicBool::new(false);
static STARTUP_LOG_BUFFER: Mutex<VecDeque<StartupLogEntry>> = Mutex::new(VecDeque::new());

#[derive(Clone, serde::Serialize, specta::Type)]
pub struct StartupLogEntry {
    pub timestamp: String,
    pub level: String,
    pub message: String,
}

pub fn capture_startup_log(level: log::Level, message: &str) {
    if STARTUP_COMPLETE.load(Ordering::Relaxed) {
        return;
    }

    let mut buffer = STARTUP_LOG_BUFFER.lock().unwrap_or_else(|e| e.into_inner());

    if buffer.len() >= STARTUP_LOG_BUFFER_SIZE {
        buffer.pop_front();
    }
    buffer.push_back(StartupLogEntry {
        timestamp: chrono::Utc::now().to_rfc3339(),
        level: level.to_string(),
        message: message.to_string(),
    });
}

pub fn mark_startup_complete() {
    STARTUP_COMPLETE.store(true, Ordering::Relaxed);
}

#[tauri::command]
#[specta::specta]
pub fn get_startup_logs() -> Vec<StartupLogEntry> {
    STARTUP_LOG_BUFFER
        .lock()
        .unwrap_or_else(|e| e.into_inner())
        .iter()
        .cloned()
        .collect()
}

pub mod fingerprint;
pub mod reads;
pub mod stats;
pub mod types;
pub mod writes;

use sqlx::sqlite::SqlitePool;
use tauri::Manager;
use types::{HistoryEntry, PlayEvent, TimeRange};

use crate::pagination::{Page, PageRequest};

pub struct HistoryDb(pub SqlitePool);

impl HistoryDb {
    pub(crate) fn pool(&self) -> &SqlitePool {
        &self.0
    }
}

pub fn init_history(app_handle: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let data_dir = match app_handle.path().app_data_dir() {
            Ok(dir) => dir,
            Err(err) => {
                log::error!("Failed to resolve app data dir: {err}");
                return;
            }
        };

        let pool = match crate::db::open(&data_dir.join("databases").join("history.db")).await {
            Ok(pool) => pool,
            Err(err) => {
                log::error!("Failed to open history database: {err}");
                return;
            }
        };

        if let Err(err) = sqlx::migrate!("./migrations/history").run(&pool).await {
            log::error!("Failed to run history migrations: {err}");
            return;
        }

        app_handle.manage(HistoryDb(pool));
        log::info!("History database initialized");
    });
}

#[tauri::command]
#[specta::specta]
pub async fn history_record_event(
    state: tauri::State<'_, HistoryDb>,
    event: PlayEvent,
) -> Result<(), String> {
    state.record_event(event).await
}

#[tauri::command]
#[specta::specta]
pub async fn history_fetch(
    state: tauri::State<'_, HistoryDb>,
    page: PageRequest,
) -> Result<Page<HistoryEntry>, String> {
    let items = state.entries(page.limit, page.offset).await?;
    let total = state.count_plays().await?;
    Ok(Page { items, total })
}

#[tauri::command]
#[specta::specta]
pub async fn history_delete_range(
    state: tauri::State<'_, HistoryDb>,
    range: TimeRange,
) -> Result<(), String> {
    state.delete_range(range.from, range.to).await
}

#[cfg(test)]
pub mod fixtures;

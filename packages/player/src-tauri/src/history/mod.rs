pub mod fingerprint;
pub mod writes;

use sqlx::sqlite::SqlitePool;
use tauri::Manager;
use writes::{PlayEvent, PlayFinalization, PlayId, TrackSnapshot};

pub struct HistoryDb(pub SqlitePool);

pub fn on_exit(app_handle: &tauri::AppHandle) {
    if let Some(db) = app_handle.try_state::<HistoryDb>() {
        let now_ms = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as i64;

        if let Err(err) = tauri::async_runtime::block_on(db.close_open_plays_at(now_ms)) {
            log::warn!("Failed to close open plays on exit: {err}");
        }
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

        let db = HistoryDb(pool);
        if let Err(err) = db.sweep_open_plays().await {
            log::warn!("Failed to sweep orphaned plays: {err}");
        }

        app_handle.manage(db);
        log::info!("History database initialized");
    });
}

#[tauri::command]
#[specta::specta]
pub async fn history_start_play(
    state: tauri::State<'_, HistoryDb>,
    snapshot: TrackSnapshot,
) -> Result<PlayId, String> {
    state.start_play(snapshot).await.map(PlayId)
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
pub async fn history_finalize_play(
    state: tauri::State<'_, HistoryDb>,
    finalization: PlayFinalization,
) -> Result<(), String> {
    state.finalize_play(finalization).await
}

#[cfg(test)]
pub mod test_helpers {
    use std::sync::atomic::{AtomicU32, Ordering};

    use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};

    static DB_COUNTER: AtomicU32 = AtomicU32::new(0);

    pub async fn test_pool() -> SqlitePool {
        let id = DB_COUNTER.fetch_add(1, Ordering::Relaxed);
        let options: SqliteConnectOptions =
            format!("sqlite:file:testdb_{id}?mode=memory&cache=shared")
                .parse()
                .unwrap();
        let options = options.foreign_keys(true);

        let pool = SqlitePool::connect_with(options).await.unwrap();
        sqlx::migrate!("./migrations/history")
            .run(&pool)
            .await
            .unwrap();

        pool
    }
}

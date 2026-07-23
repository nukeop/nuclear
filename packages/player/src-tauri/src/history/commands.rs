use crate::pagination::{Page, PageRequest};

use super::stats::listening_time::{DailyListeningTime, HourlyListeningTime};
use super::types::{HistoryEntry, PlayEvent, TimeRange};
use super::HistoryDb;

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
pub async fn history_hourly_listening_time(
    state: tauri::State<'_, HistoryDb>,
    range: TimeRange,
) -> Result<HourlyListeningTime, String> {
    let values = state.hourly_listening_time(range.from, range.to).await?;
    Ok(HourlyListeningTime { values })
}

#[tauri::command]
#[specta::specta]
pub async fn history_daily_listening_time(
    state: tauri::State<'_, HistoryDb>,
    range: TimeRange,
) -> Result<Vec<DailyListeningTime>, String> {
    state.daily_listening_time(range.from, range.to).await
}

#[tauri::command]
#[specta::specta]
pub async fn history_delete_range(
    state: tauri::State<'_, HistoryDb>,
    range: TimeRange,
) -> Result<(), String> {
    state.delete_range(range.from, range.to).await
}

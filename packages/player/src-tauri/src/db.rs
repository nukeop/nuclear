use std::path::Path;

use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePool};

pub fn configure(options: SqliteConnectOptions) -> SqliteConnectOptions {
    options
        .journal_mode(SqliteJournalMode::Wal)
        .foreign_keys(true)
}

pub async fn open(path: &Path) -> Result<SqlitePool, String> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|err| format!("Failed to create database directory: {err}"))?;
    }

    let options = configure(
        SqliteConnectOptions::new()
            .filename(path)
            .create_if_missing(true),
    );

    SqlitePool::connect_with(options)
        .await
        .map_err(|err| format!("Failed to open database: {err}"))
}

use std::path::Path;

use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePool};

pub async fn open(path: &Path) -> Result<SqlitePool, String> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|err| format!("Failed to create database directory: {err}"))?;
    }

    let options = SqliteConnectOptions::new()
        .filename(path)
        .create_if_missing(true)
        .journal_mode(SqliteJournalMode::Wal)
        .foreign_keys(true);

    SqlitePool::connect_with(options)
        .await
        .map_err(|err| format!("Failed to open database: {err}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn creates_parent_dirs_and_database_file() {
        let dir = tempfile::tempdir().unwrap();
        let db_path = dir.path().join("nested").join("test.db");

        let pool = open(&db_path).await.unwrap();
        pool.close().await;

        assert!(db_path.exists());
    }
}

pub mod fingerprint;

use sqlx::sqlite::SqlitePool;

pub struct HistoryDb(pub SqlitePool);

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

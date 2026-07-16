use serde::{Deserialize, Serialize};
use specta_typescript::Number;

#[derive(Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PageRequest {
    #[specta(type = Number<i64>)]
    pub limit: i64,
    #[specta(type = Number<i64>)]
    pub offset: i64,
}

#[derive(Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct Page<T> {
    pub items: Vec<T>,
    #[specta(type = Number<i64>)]
    pub total: i64,
}

#[derive(Debug, Clone)]
pub struct LocalTrack {
    pub uuid: String,
    pub artist: Option<String>,
    pub title: Option<String>,
    pub album: Option<String>,
    pub duration: u32,
    pub position: Option<u32>,
    pub year: Option<u32>,

    pub filename: String,
    pub path: String,
}

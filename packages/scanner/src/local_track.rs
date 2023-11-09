use crate::metadata::AudioMetadata;

#[derive(Debug, Clone)]
pub struct LocalTrack {
    pub uuid: String,

    pub metadata: AudioMetadata,

    pub filename: String,
    pub path: String,
}

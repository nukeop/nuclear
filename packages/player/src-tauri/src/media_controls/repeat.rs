use serde::{Deserialize, Serialize};
use souvlaki::Repeat;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RepeatMode {
    Off,
    All,
    One,
}

impl From<RepeatMode> for Repeat {
    fn from(mode: RepeatMode) -> Self {
        match mode {
            RepeatMode::Off => Repeat::None,
            RepeatMode::All => Repeat::Playlist,
            RepeatMode::One => Repeat::Track,
        }
    }
}

impl From<Repeat> for RepeatMode {
    fn from(repeat: Repeat) -> Self {
        match repeat {
            Repeat::None => RepeatMode::Off,
            Repeat::Playlist => RepeatMode::All,
            Repeat::Track => RepeatMode::One,
        }
    }
}

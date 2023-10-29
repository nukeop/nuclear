use id3::{Error, Tag};
use std::path::Path;

pub trait TagReader {
    fn read_from_path(path: impl AsRef<Path>) -> Result<Tag, Error>;
}

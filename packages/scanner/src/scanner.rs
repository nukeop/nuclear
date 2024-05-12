use id3::{Error, Tag};
use std::collections::LinkedList;
use std::ffi::OsStr;
use std::path::Path;
use uuid::Uuid;

use crate::error::{MetadataError, ScannerError};
use crate::local_track::LocalTrack;
use crate::metadata::{
    self, AudioMetadata, FlacMetadataExtractor, MetadataExtractor, Mp3MetadataExtractor,
    Mp4MetadataExtractor, OggMetadataExtractor,
};

pub trait TagReader {
    fn read_from_path(path: impl AsRef<Path>) -> Result<Tag, Error>;
}

fn get_extension(path: &str) -> Option<&str> {
    Path::new(path).extension().and_then(OsStr::to_str)
}

pub fn extractor_from_path(path: &str) -> Option<Box<dyn MetadataExtractor>> {
    match get_extension(path) {
        Some("mp3") => Some(Box::new(Mp3MetadataExtractor)),
        Some("ogg") => Some(Box::new(OggMetadataExtractor)),
        Some("flac") => Some(Box::new(FlacMetadataExtractor)),
        Some("mp4") => Some(Box::new(Mp4MetadataExtractor)),
        _ => None,
    }
}

pub fn visit_file<F>(
    path: String,
    extractor_provider: F,
    thumbnails_dir: &str,
) -> Result<LocalTrack, ScannerError>
where
    F: Fn(&str) -> Option<Box<dyn MetadataExtractor>>,
{
    let extractor: Box<dyn MetadataExtractor> = extractor_provider(&path)
        .ok_or_else(|| ScannerError::new(&format!("Unsupported file format: {}", path), &path))?;
    let metadata = extractor.extract_metadata(&path, thumbnails_dir);
    let filename = path.split("/").last().map(|s| s.to_string()).unwrap();

    if let Ok(mut metadata) = metadata {
        metadata.title = metadata.title.clone().or(Some(filename.clone()));
        metadata.artist = metadata.artist.clone().or(Some("unknown".to_string()));
        Ok(LocalTrack {
            uuid: Uuid::new_v4().to_string(),
            metadata: metadata,
            filename: path.split("/").last().map(|s| s.to_string()).unwrap(),
            path: path.clone(),
        })
    } else {
        Err(ScannerError::new(
            &format!("Error reading file: {}", metadata.unwrap_err()),
            &path,
        ))
    }
}

pub fn visit_directory(
    path: String,
    supported_formats: Vec<String>,
    dirs_to_scan_queue: &mut LinkedList<String>,
    files_to_scan_queue: &mut LinkedList<String>,
) {
    // Read the contents of the directory
    let dir = std::fs::read_dir(path.clone()).unwrap();
    for entry in dir {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_dir() {
            // Add the directory to the queue
            dirs_to_scan_queue.push_back(path.to_str().unwrap().to_string());
        } else if let Some(extension) = path.extension().and_then(|ext| ext.to_str()) {
            // Add the file to the queue, if it's a supported format
            if supported_formats.contains(&extension.to_string()) {
                files_to_scan_queue.push_back(path.to_str().unwrap().to_string());
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::metadata::AudioMetadataBuilder;

    use super::*;

    #[derive(Debug, Clone, Default)]
    struct TestMetadataExtractor {
        pub test_metadata: AudioMetadata,
    }
    impl TestMetadataExtractor {
        pub fn new(metadata: AudioMetadata) -> TestMetadataExtractor {
            TestMetadataExtractor {
                test_metadata: metadata,
            }
        }
    }
    impl MetadataExtractor for TestMetadataExtractor {
        fn extract_metadata(
            &self,
            _path: &str,
            _thumbnails_dir: &str,
        ) -> Result<AudioMetadata, MetadataError> {
            return Ok(self.test_metadata.clone());
        }
    }

    pub fn test_extractor_from_path(_path: &str) -> Option<Box<dyn MetadataExtractor>> {
        Some(Box::new(TestMetadataExtractor::new(
            AudioMetadataBuilder::default()
                .artist("Test Artist".to_string())
                .title("Test Title".to_string())
                .album("Test Album".to_string())
                .duration(10)
                .position(1)
                .disc(1)
                .year("2020".to_string())
                .thumbnail("http://localhost:8080/thumbnails/0b/0b0b0b0b0b0b0b0b.webp".to_string())
                .build()
                .unwrap(),
        )))
    }

    #[test]
    fn test_visit_file() {
        let path = "tests/test.mp3".to_string();
        let thumbnails_dir: String = "tests/thumbnails".to_string();
        let local_track = visit_file(path, test_extractor_from_path, &thumbnails_dir).unwrap();
        assert_eq!(local_track.filename, "test.mp3");
        assert_eq!(local_track.metadata.artist, Some("Test Artist".to_string()));
        assert_eq!(local_track.metadata.title, Some("Test Title".to_string()));
        assert_eq!(local_track.metadata.album, Some("Test Album".to_string()));
        assert_eq!(local_track.metadata.duration, Some(10));
        assert_eq!(local_track.metadata.position, Some(1));
        assert_eq!(local_track.metadata.disc, Some(1));
        assert_eq!(local_track.metadata.year, Some("2020".to_string()));
        assert_eq!(
            local_track.metadata.thumbnail,
            Some("http://localhost:8080/thumbnails/0b/0b0b0b0b0b0b0b0b.webp".to_string())
        );
    }

    pub fn test_extractor_from_path_no_metadata(_path: &str) -> Option<Box<dyn MetadataExtractor>> {
        Some(Box::new(TestMetadataExtractor::new(
            AudioMetadata::default(),
        )))
    }

    #[test]
    fn test_visit_file_with_no_metadata() {
        let path = "tests/test.mp3".to_string();
        let thumbnails_dir: String = "tests/thumbnails".to_string();
        let local_track =
            visit_file(path, test_extractor_from_path_no_metadata, &thumbnails_dir).unwrap();
        assert_eq!(local_track.filename, "test.mp3");
        assert_eq!(local_track.metadata.artist, Some("unknown".to_string()));
        assert_eq!(local_track.metadata.title, Some("test.mp3".to_string()));
        assert_eq!(local_track.metadata.album, None);
        assert_eq!(local_track.metadata.duration, None);
        assert_eq!(local_track.metadata.position, None);
        assert_eq!(local_track.metadata.disc, None);
        assert_eq!(local_track.metadata.year, None);
        assert_eq!(local_track.metadata.thumbnail, None);
    }
}

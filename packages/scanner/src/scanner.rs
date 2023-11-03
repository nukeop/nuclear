use id3::{Error, Tag, TagLike};
use std::collections::LinkedList;
use std::path::Path;
use uuid::Uuid;

use crate::error::ScannerError;
use crate::local_track::LocalTrack;
use crate::thumbnails::generate_thumbnail;

pub trait TagReader {
    fn read_from_path(path: impl AsRef<Path>) -> Result<Tag, Error>;
}

pub fn visit_file<F>(
    path: String,
    tag_reader: F,
    thumbnails_dir: &str,
) -> Result<LocalTrack, ScannerError>
where
    F: FnOnce(&str) -> Result<Tag, id3::Error>,
{
    let tag = tag_reader(&path);

    match tag {
        Ok(tag) => Ok(LocalTrack {
            uuid: Uuid::new_v4().to_string(),
            artist: tag.artist().map(|s| s.to_string()),
            title: tag.title().map(|s| s.to_string()),
            album: tag.album().map(|s| s.to_string()),
            duration: tag.duration().unwrap_or(0),
            thumbnail: generate_thumbnail(&path, thumbnails_dir),
            position: tag.track(),
            disc: tag.disc(),
            year: tag.year().map(|s| s as u32),
            filename: path.split("/").last().map(|s| s.to_string()).unwrap(),
            path: path.clone(),
        }),
        Err(e) => Err(ScannerError {
            message: format!("Error reading file: {}", e),
        }),
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
    use id3::{
        frame::{Picture, PictureType},
        Content, Frame,
    };

    use super::*;

    #[test]
    fn test_visit_file_with_valid_file() {
        // With mocked tag
        let path = String::from("path/to/valid/file.mp3");
        let result = visit_file(path.clone(), |_inner_path| {
            let mut tag = Tag::new();
            tag.set_artist("Artist");
            tag.set_title("Title");
            tag.set_album("Album");
            tag.set_duration(123);
            tag.set_track(1);
            tag.set_year(2020);
            let picture = Picture {
                mime_type: String::new(),
                picture_type: PictureType::CoverFront,
                description: String::new(),
                data: vec![1, 2, 3],
            };
            tag.add_frame(Frame::with_content(
                "APIC",
                Content::Picture(picture.clone()),
            ));
            Ok(tag)
        });

        if let Some(track) = result.ok() {
            //check uuid format
            assert_eq!(
                track.uuid,
                Uuid::parse_str(&track.uuid).unwrap().to_string()
            );
            assert_eq!(track.artist, Some(String::from("Artist")));
            assert_eq!(track.title, Some(String::from("Title")));
            assert_eq!(track.album, Some(String::from("Album")));
            assert_eq!(track.duration, 123);
            assert_eq!(track.position, Some(1));
            assert_eq!(track.year, Some(2020));
            assert_eq!(track.filename, String::from("file.mp3"));
            assert_eq!(track.path, path);
            assert_eq!(
                track.thumbnail,
                Some("file://path/to/valid/file.webp".to_string())
            );
        } else {
            panic!("Result is not ok");
        }
    }

    #[test]
    fn test_visit_file_with_no_tags() {
        // With mocked tag
        let path = String::from("path/to/invalid/file.mp3");
        let result = visit_file(path.clone(), |_inner_path| {
            Err(id3::Error::new(id3::ErrorKind::NoTag, ""))
        });

        if let Some(error) = result.err() {
            assert_eq!(error.message, String::from("Error reading file: NoTag"));
        } else {
            panic!("Result is not err");
        }
    }
}

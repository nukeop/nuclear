use std::collections::HashSet;

use derive_builder::Builder;
use id3::TagLike;
use metaflac;

use crate::{
    error::MetadataError,
    thumbnails::ThumbnailGenerator,
    thumbnails::{FlacThumbnailGenerator, Mp3ThumbnailGenerator},
};

#[derive(Default, Debug, Clone, Builder)]
#[builder(setter(strip_option))]
pub struct AudioMetadata {
    pub artist: Option<String>,
    pub title: Option<String>,
    pub album: Option<String>,
    pub duration: Option<u32>,
    pub disc: Option<u32>,
    pub position: Option<u32>,
    pub year: Option<u32>,
    pub thumbnail: Option<String>,
}

impl AudioMetadata {
    pub fn new() -> Self {
        Self {
            artist: None,
            title: None,
            album: None,
            duration: None,
            disc: None,
            position: None,
            year: None,
            thumbnail: None,
        }
    }
}

pub trait MetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        thumbnails_dir: &str,
        created_thumbnails_hashset: &mut HashSet<String>,
    ) -> Result<AudioMetadata, MetadataError>;
}

#[derive(Debug, Clone)]

pub struct Mp3MetadataExtractor;
impl MetadataExtractor for Mp3MetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        thumbnails_dir: &str,
        created_thumbnails_hashset: &mut HashSet<String>,
    ) -> Result<AudioMetadata, MetadataError> {
        let tag = id3::Tag::read_from_path(path).unwrap();
        let mut metadata = AudioMetadata::new();

        metadata.artist = tag.artist().map(|s| s.to_string());
        metadata.title = tag.title().map(|s| s.to_string());
        metadata.album = tag.album().map(|s| s.to_string());
        metadata.duration = tag.duration();
        metadata.position = tag.track();
        metadata.disc = tag.disc();
        metadata.year = tag.year().map(|s| s as u32);

        metadata.thumbnail = Mp3ThumbnailGenerator::generate_thumbnail(
            &path,
            metadata.album.as_deref(),
            thumbnails_dir,
        );

        Ok(metadata)
    }
}

pub struct FlacMetadataExtractor;
impl FlacMetadataExtractor {
    fn extract_string_metadata(
        tag: &metaflac::Tag,
        key: &str,
        fallback_key: Option<&str>,
    ) -> Option<String> {
        tag.get_vorbis(key)
            .and_then(|mut iter| iter.next())
            .map(|s| s.to_string())
            .or_else(|| {
                fallback_key.and_then(|key| {
                    tag.get_vorbis(key)
                        .and_then(|mut iter| iter.next())
                        .map(|s| s.to_string())
                })
            })
    }

    fn extract_numeric_metadata<T: std::str::FromStr>(tag: &metaflac::Tag, key: &str) -> Option<T> {
        tag.get_vorbis(key)
            .and_then(|mut iter| iter.next())
            .and_then(|s| s.parse::<T>().ok())
    }
}

impl MetadataExtractor for FlacMetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        thumbnails_dir: &str,
        created_thumbnails_hashset: &mut HashSet<String>,
    ) -> Result<AudioMetadata, MetadataError> {
        // Extract metadata from a FLAC file.
        let tag = metaflac::Tag::read_from_path(path).unwrap();
        let mut metadata = AudioMetadata::new();
        metadata.artist = Self::extract_string_metadata(&tag, "ARTIST", Some("ALBUMARTIST"));
        metadata.title = Self::extract_string_metadata(&tag, "TITLE", None);
        metadata.album = Self::extract_string_metadata(&tag, "ALBUM", None);
        metadata.duration = Self::extract_numeric_metadata(&tag, "LENGTH");
        metadata.position = Self::extract_numeric_metadata(&tag, "TRACKNUMBER");
        metadata.disc = Self::extract_numeric_metadata(&tag, "DISCNUMBER");
        metadata.year = Self::extract_numeric_metadata(&tag, "DATE");
        metadata.thumbnail = FlacThumbnailGenerator::generate_thumbnail(
            &path,
            metadata.album.as_deref(),
            thumbnails_dir,
        );

        Ok(metadata)
    }
}

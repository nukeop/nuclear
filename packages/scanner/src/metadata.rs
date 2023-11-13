use std::fs::File;

use derive_builder::Builder;
use id3::TagLike;
use lewton::inside_ogg::OggStreamReader;
use metaflac;

use crate::{
    error::MetadataError,
    thumbnails::{FlacThumbnailGenerator, Mp3ThumbnailGenerator},
    thumbnails::{Mp4ThumbnailGenerator, ThumbnailGenerator},
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
    ) -> Result<AudioMetadata, MetadataError>;
}

#[derive(Debug, Clone)]

pub struct Mp3MetadataExtractor;
impl MetadataExtractor for Mp3MetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        thumbnails_dir: &str,
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
    ) -> Result<AudioMetadata, MetadataError> {
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

// pub struct OggMetadataExtractor;

// impl OggMetadataExtractor {
//     fn extract_vorbis_comment(metadata: &mut AudioMetadata, comments: &[(String, String)]) {
//         for (key, value) in comments {
//             match key.as_str() {
//                 "ARTIST" | "PERFORMER" => metadata.artist = Some(value.clone()),
//                 "TITLE" => metadata.title = Some(value.clone()),
//                 "ALBUM" => metadata.album = Some(value.clone()),
//                 "TRACKNUMBER" => metadata.position = value.parse().ok(),
//                 "DISCNUMBER" => metadata.disc = value.parse().ok(),
//                 "DATE" => metadata.year = value.parse().ok(),
//                 _ => {}
//             }
//         }
//     }
// }

// impl MetadataExtractor for OggMetadataExtractor {
//     fn extract_metadata(
//         &self,
//         path: &str,
//         _thumbnails_dir: &str, // Thumbnail generation is not handled here
//     ) -> Result<AudioMetadata, MetadataError> {
//         let file = File::open(path)?;
//         let mut ogg_reader = OggStreamReader::new(file)?;

//         let mut metadata = AudioMetadata::new();

//         // Check if there are Vorbis comments, assumes Vorbis codec
//         if let Some(comments) = ogg_reader.comment_hdrs() {
//             Self::extract_vorbis_comment(&mut metadata, &comments.user_comments);
//         }

//         metadata.duration = ogg_reader.ident_hdr().map(|ident| {
//             let total_samples = ogg_reader.len() as u32;
//             let sample_rate = ident.audio_sample_rate;
//             total_samples / sample_rate
//         });

//         Ok(metadata)
//     }
// }

pub struct Mp4MetadataExtractor;

impl Mp4MetadataExtractor {}

impl MetadataExtractor for Mp4MetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        thumbnails_dir: &str,
    ) -> Result<AudioMetadata, MetadataError> {
        let tag = mp4ameta::Tag::read_from_path(path).unwrap();

        let mut metadata = AudioMetadata::new();

        metadata.artist = tag.artist().map(|s| s.to_string());
        metadata.title = tag.title().map(|s| s.to_string());
        metadata.album = tag.album().map(|s| s.to_string());
        metadata.duration = tag.duration().map(|d| d.as_secs() as u32);
        metadata.position = tag.track_number().map(|n| n as u32);
        metadata.disc = tag.disc_number().map(|n| n as u32);
        metadata.year = tag.year().map(|y: &str| y.parse().unwrap());

        metadata.thumbnail = Mp4ThumbnailGenerator::generate_thumbnail(
            &path,
            metadata.album.as_deref(),
            thumbnails_dir,
        );

        Ok(metadata)
    }
}

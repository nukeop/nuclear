use std::fs::File;

use derive_builder::Builder;
use id3::TagLike;
use metaflac;
use symphonia::core::{
    formats::FormatOptions,
    io::MediaSourceStream,
    meta::{MetadataOptions, StandardTagKey},
    probe::Hint,
};

use crate::{
    error::MetadataError,
    thumbnails::{FlacThumbnailGenerator, Mp3ThumbnailGenerator},
    thumbnails::{Mp4ThumbnailGenerator, ThumbnailGenerator},
};

// TODO: There's a lot of code duplication in the metadata extractors for
// different formats. It should be possible to refactor this later.

#[derive(Default, Debug, Clone, Builder)]
#[builder(setter(strip_option))]
pub struct AudioMetadata {
    pub artist: Option<String>,
    pub title: Option<String>,
    pub album: Option<String>,
    pub duration: Option<u32>,
    pub disc: Option<u32>,
    pub position: Option<u32>,
    pub year: Option<String>,
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
        let tag = id3::Tag::read_from_path(path);

        if let Err(e) = tag {
            return Err(MetadataError::new(
                format!("Could not read metadata from file {}: {}", path, e).as_str(),
            ));
        }

        let tag = tag.unwrap();
        let mut metadata = AudioMetadata::new();

        metadata.artist = tag.artist().map(|s| s.to_string());
        metadata.title = tag.title().map(|s| s.to_string());
        metadata.album = tag.album().map(|s| s.to_string());
        let duration = mp3_duration::from_path(&path).map(|duration| duration.as_secs() as u32);

        match duration {
            Ok(duration) => metadata.duration = Some(duration),
            Err(_) => metadata.duration = None,
        }
        metadata.position = tag.track();
        metadata.disc = tag.disc();
        metadata.year = tag.year().map(|y| y.to_string());

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
        let tag = metaflac::Tag::read_from_path(path);

        if let Err(e) = tag {
            return Err(MetadataError::new(
                format!("Could not read metadata from file {}: {}", path, e).as_str(),
            ));
        }

        let tag = tag.unwrap();
        let mut metadata = AudioMetadata::new();
        metadata.artist = Self::extract_string_metadata(&tag, "ARTIST", Some("ALBUMARTIST"));
        metadata.title = Self::extract_string_metadata(&tag, "TITLE", None);
        metadata.album = Self::extract_string_metadata(&tag, "ALBUM", None);
        let total_samples = tag.get_streaminfo().unwrap().total_samples;
        let sample_rate = tag.get_streaminfo().unwrap().sample_rate;
        metadata.duration = Some(total_samples as u32 / (sample_rate as u32));
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

pub struct OggMetadataExtractor;

impl OggMetadataExtractor {}

impl MetadataExtractor for OggMetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        _thumbnails_dir: &str, // Thumbnail generation is not handled here
    ) -> Result<AudioMetadata, MetadataError> {
        let file = File::open(path);
        if file.is_err() {
            return Err(MetadataError::new(
                format!("Could not open file {}", path).as_str(),
            ));
        }

        let file = File::open(path);

        if let Err(_) = file {
            return Err(MetadataError::new(
                format!("Could not open file {}", path).as_str(),
            ));
        }

        let mss = MediaSourceStream::new(Box::new(file.unwrap()), Default::default());

        let meta_opts: MetadataOptions = Default::default();
        let fmt_opts: FormatOptions = Default::default();

        let mut hint = Hint::new();
        hint.with_extension("ogg");

        let mut probed = symphonia::default::get_probe()
            .format(&hint, mss, &fmt_opts, &meta_opts)
            .expect("unsupported format");
        let mut metadata = AudioMetadata::new();

        let track = probed.format.default_track().unwrap();
        let time_base = track.codec_params.time_base.unwrap();
        let duration = track
            .codec_params
            .n_frames
            .map(|frames| track.codec_params.start_ts + frames);

        metadata.duration = duration.map(|d| ((d as u32) * time_base.numer / time_base.denom));

        if let Some(meta) = probed.format.metadata().current() {
            for tag in meta.tags().iter() {
                if tag.is_known() {
                    match tag.std_key {
                        Some(StandardTagKey::TrackTitle) => {
                            metadata.title = Some(tag.value.to_string());
                        }
                        Some(StandardTagKey::Artist) => {
                            metadata.artist = Some(tag.value.to_string());
                        }
                        Some(StandardTagKey::Album) => {
                            metadata.album = Some(tag.value.to_string());
                        }
                        Some(StandardTagKey::TrackNumber) => {
                            metadata.position = Some(tag.value.to_string().parse::<u32>().unwrap());
                        }
                        Some(StandardTagKey::DiscNumber) => {
                            metadata.disc = Some(tag.value.to_string().parse::<u32>().unwrap());
                        }
                        Some(StandardTagKey::Date) => {
                            metadata.year = Some(tag.value.to_string());
                        }
                        _ => {}
                    }
                }
            }
        }
        Ok(metadata)
    }
}

pub struct Mp4MetadataExtractor;

impl Mp4MetadataExtractor {}

impl MetadataExtractor for Mp4MetadataExtractor {
    fn extract_metadata(
        &self,
        path: &str,
        thumbnails_dir: &str,
    ) -> Result<AudioMetadata, MetadataError> {
        let tag = mp4ameta::Tag::read_from_path(path);

        if let Err(e) = tag {
            return Err(MetadataError::new(
                format!("Could not read metadata from file {}: {}", path, e).as_str(),
            ));
        }

        let tag = tag.unwrap();
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

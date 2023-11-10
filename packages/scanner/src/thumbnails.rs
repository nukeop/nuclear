use id3::Tag;
use image::{imageops::resize, imageops::FilterType, io::Reader as ImageReader, ImageFormat};
use md5;
use metaflac;
use std::io::{self, Cursor};
use std::path::{Path, PathBuf};

use crate::error::ThumbnailError;

pub trait ThumbnailGenerator {
    fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String>;
}

fn hash_thumb_filename(path: &str) -> Result<String, io::Error> {
    let filename = Path::new(path).file_name().ok_or_else(|| {
        io::Error::new(
            io::ErrorKind::InvalidInput,
            format!("Invalid path: {}", path),
        )
    })?;
    let hash = md5::compute(filename.to_string_lossy().as_bytes());
    Ok(format!("{:x}.webp", hash))
}

pub fn create_thumbnails_dir(thumbnails_dir: &str) -> io::Result<()> {
    let thumbnails_dir_path = Path::new(thumbnails_dir);

    if !thumbnails_dir_path.exists() {
        std::fs::create_dir(thumbnails_dir_path)
    } else {
        Ok(())
    }
}

fn url_path_from_path(path: &str) -> String {
    let path = path.replace("\\", "/");
    let path = path.replace(" ", "%20");
    format!("file://{}", path)
}

pub struct Mp3ThumbnailGenerator;
impl ThumbnailGenerator for Mp3ThumbnailGenerator {
    fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String> {
        let mut thumbnail_path = PathBuf::from(thumbnails_dir);

        let thumbnail_filename = hash_thumb_filename(filename);

        let thumbnail_filename = match thumbnail_filename {
            Ok(filename) => filename,
            Err(e) => return None,
        };
        thumbnail_path.push(thumbnail_filename);

        let thumbnail_path_str = thumbnail_path.to_str()?;

        if thumbnail_path.exists() {
            return Some(url_path_from_path(thumbnail_path_str));
        }

        let tag = Tag::read_from_path(filename).unwrap();
        let thumbnail = tag
            .pictures()
            .find(|p| p.picture_type == id3::frame::PictureType::CoverFront)
            .map(|p| p.data.clone());

        if let Some(thumbnail) = thumbnail {
            let img = ImageReader::new(Cursor::new(&thumbnail))
                .with_guessed_format()
                .unwrap()
                .decode()
                .unwrap();

            let img = resize(&img, 192, 192, FilterType::Lanczos3);
            img.save_with_format(thumbnail_path_str, ImageFormat::WebP)
                .unwrap();
        } else {
            return None;
        }

        Some(url_path_from_path(thumbnail_path_str))
    }
}

pub struct FlacThumbnailGenerator;
impl ThumbnailGenerator for FlacThumbnailGenerator {
    fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String> {
        let mut thumbnail_path = PathBuf::from(thumbnails_dir);

        let thumbnail_filename = hash_thumb_filename(filename);

        let thumbnail_filename = match thumbnail_filename {
            Ok(filename) => filename,
            Err(e) => return None,
        };
        thumbnail_path.push(thumbnail_filename);

        let thumbnail_path_str = thumbnail_path.to_str()?;

        if thumbnail_path.exists() {
            return Some(url_path_from_path(thumbnail_path_str));
        }

        let tag = metaflac::Tag::read_from_path(filename).unwrap();
        let thumbnail = tag.pictures().next().map(|p| p.data.clone());

        if let Some(thumbnail) = thumbnail {
            let img = ImageReader::new(Cursor::new(&thumbnail))
                .with_guessed_format()
                .unwrap()
                .decode()
                .unwrap();

            let img = resize(&img, 192, 192, FilterType::Lanczos3);
            img.save_with_format(thumbnail_path_str, ImageFormat::WebP)
                .unwrap();
        } else {
            return None;
        }

        Some(url_path_from_path(thumbnail_path_str))
    }
}

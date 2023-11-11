use id3::Tag;
use image::{
    imageops::resize, imageops::FilterType, io::Reader as ImageReader, DynamicImage, ImageFormat,
};
use image::{ImageBuffer, ImageError, ImageResult, Rgba};
use md5;
use metaflac::Tag as FlacTag;
use std::io::{self, Cursor};
use std::path::{Path, PathBuf};

pub trait ThumbnailGenerator {
    fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String>;
    fn read_image_data(filename: &str) -> Option<Vec<u8>>;
}

pub struct Mp3ThumbnailGenerator;
impl ThumbnailGenerator for Mp3ThumbnailGenerator {
    fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String> {
        generate_thumbnail_common::<Self>(filename, thumbnails_dir)
    }

    fn read_image_data(filename: &str) -> Option<Vec<u8>> {
        let tag = Tag::read_from_path(filename).ok()?;
        tag.pictures()
            .find(|p| p.picture_type == id3::frame::PictureType::CoverFront)
            .map(|p| p.data.clone())
    }
}

pub struct FlacThumbnailGenerator;
impl ThumbnailGenerator for FlacThumbnailGenerator {
    fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String> {
        generate_thumbnail_common::<Self>(filename, thumbnails_dir)
    }

    fn read_image_data(filename: &str) -> Option<Vec<u8>> {
        let tag = FlacTag::read_from_path(filename).ok()?;
        tag.pictures().next().map(|p| p.data.clone())
    }
}

fn generate_thumbnail_common<T: ThumbnailGenerator>(
    filename: &str,
    thumbnails_dir: &str,
) -> Option<String> {
    let thumbnail_path = create_and_get_thumbnail_path(filename, thumbnails_dir)?;

    if Path::new(&thumbnail_path).exists() {
        Some(url_path_from_path(&thumbnail_path))
    } else if let Some(thumbnail_data) = T::read_image_data(filename) {
        resize_and_save_thumbnail(&thumbnail_data, Path::new(&thumbnail_path)).ok()?;
        Some(url_path_from_path(&thumbnail_path))
    } else {
        None
    }
}

fn resize_and_save_thumbnail(data: &[u8], path: &Path) -> ImageResult<()> {
    let img = get_resized_image(data)?;
    img.save_with_format(path, ImageFormat::WebP)
}

fn get_resized_image(data: &[u8]) -> Result<ImageBuffer<Rgba<u8>, Vec<u8>>, ImageError> {
    ImageReader::new(Cursor::new(data))
        .with_guessed_format()?
        .decode()
        .map(|img| resize(&img, 192, 192, FilterType::Lanczos3))
}

fn create_and_get_thumbnail_path(filename: &str, thumbnails_dir: &str) -> Option<String> {
    if let Ok(thumbnail_filename) = hash_thumb_filename(filename) {
        let mut thumbnail_path = PathBuf::from(thumbnails_dir);
        thumbnail_path.push(thumbnail_filename);
        thumbnail_path.to_str().map(str::to_owned)
    } else {
        None
    }
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

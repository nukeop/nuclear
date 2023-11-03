use id3::Tag;
use image::{imageops::resize, imageops::FilterType, io::Reader as ImageReader, ImageFormat};
use md5;
use std::io::Cursor;
use std::path::{Path, PathBuf};

fn hash_thumb_filename(path: &str) -> String {
    let filename = Path::new(path).file_name().unwrap();
    let hash = md5::compute(filename.to_string_lossy().as_bytes());
    format!("{:x}.webp", hash)
}

pub fn create_thumbnails_dir(thumbnails_dir: &str) {
    let thumbnails_dir_path = Path::new(thumbnails_dir);

    if !thumbnails_dir_path.exists() {
        std::fs::create_dir(thumbnails_dir_path).unwrap();
    }
}

fn url_path_from_path(path: &str) -> String {
    let path = path.replace("\\", "/");
    let path = path.replace(" ", "%20");
    format!("file://{}", path)
}

pub fn generate_thumbnail(filename: &str, thumbnails_dir: &str) -> Option<String> {
    let mut thumbnail_path = PathBuf::from(thumbnails_dir);

    thumbnail_path.push(hash_thumb_filename(filename));

    let thumbnail_path_str = thumbnail_path.to_str().unwrap();

    if Path::new(thumbnail_path_str).exists() {
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

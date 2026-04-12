use std::fs::{self, File};
use std::io::BufReader;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::command;
use zip::ZipArchive;

#[command]
pub fn is_flatpak() -> bool {
    std::env::var("FLATPAK_ID").is_ok()
}

#[command]
pub fn copy_dir_recursive(from: PathBuf, to: PathBuf) -> Result<(), String> {
    fn inner(from: &Path, to: &Path) -> Result<(), std::io::Error> {
        fs::create_dir_all(to)?;
        for entry in fs::read_dir(from)? {
            let entry = entry?;
            let file_type = entry.file_type()?;
            let from_path = entry.path();
            let to_path: PathBuf = to.join(entry.file_name());
            if file_type.is_dir() {
                inner(&from_path, &to_path)?;
            } else if file_type.is_file() {
                if let Some(parent) = to_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                fs::copy(&from_path, &to_path)?;
            } else if file_type.is_symlink() {
                let target = fs::read_link(&from_path)?;
                let target_abs = if target.is_absolute() {
                    target
                } else {
                    from_path.parent().unwrap_or(from).join(target)
                };
                if target_abs.is_dir() {
                    inner(&target_abs, &to_path)?;
                } else if target_abs.is_file() {
                    if let Some(parent) = to_path.parent() {
                        fs::create_dir_all(parent)?;
                    }
                    fs::copy(&target_abs, &to_path)?;
                }
            }
        }
        Ok(())
    }

    let from_p = Path::new(&from);
    let to_p = Path::new(&to);
    inner(from_p, to_p).map_err(|e| {
        log::error!("copy_dir_recursive failed: {}", e);
        e.to_string()
    })
}

#[command]
pub fn extract_zip(zip_path: PathBuf, dest_path: PathBuf) -> Result<(), String> {
    fn inner(zip_path: &Path, dest_path: &Path) -> Result<(), Box<dyn std::error::Error>> {
        let file = File::open(zip_path)?;
        let mut archive = ZipArchive::new(BufReader::new(file))?;
        fs::create_dir_all(dest_path)?;

        for i in 0..archive.len() {
            let mut entry = archive.by_index(i)?;
            let out_path = dest_path.join(entry.mangled_name());

            if entry.is_dir() {
                fs::create_dir_all(&out_path)?;
            } else {
                if let Some(parent) = out_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                let mut out_file = File::create(&out_path)?;
                std::io::copy(&mut entry, &mut out_file)?;

                #[cfg(unix)]
                if let Some(mode) = entry.unix_mode() {
                    use std::os::unix::fs::PermissionsExt;
                    fs::set_permissions(&out_path, fs::Permissions::from_mode(mode)).ok();
                }
            }
        }
        Ok(())
    }

    inner(&zip_path, &dest_path).map_err(|e| {
        log::error!("extract_zip failed for {:?}: {}", zip_path, e);
        e.to_string()
    })?;

    log::info!("Extracted {:?} to {:?}", zip_path, dest_path);
    Ok(())
}

#[command]
pub async fn download_file(url: String, dest_path: PathBuf) -> Result<(), String> {
    use std::time::Duration;
    use tokio::io::AsyncWriteExt;

    async fn inner(url: &str, dest_path: &Path) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Downloading {} to {:?}", url, dest_path);

        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(300))
            .connect_timeout(Duration::from_secs(30))
            .build()?;

        let response = client.get(url).send().await?;

        if !response.status().is_success() {
            return Err(format!("HTTP error: {}", response.status()).into());
        }

        if let Some(parent) = dest_path.parent() {
            fs::create_dir_all(parent)?;
        }

        let mut file = tokio::fs::File::create(dest_path).await?;
        let mut stream = response.bytes_stream();

        use futures::StreamExt;
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            file.write_all(&chunk).await?;
        }

        log::info!("Download complete: {:?}", dest_path);
        Ok(())
    }

    inner(&url, &dest_path).await.map_err(|e| {
        log::error!("download_file failed for {}: {}", url, e);
        e.to_string()
    })
}

#[command]
pub fn is_matugen_available() -> bool {
    Command::new("matugen")
        .arg("--version")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

#[command]
pub fn get_matugen_css_path() -> Result<String, String> {
    let config_dir = dirs::config_dir()
        .ok_or_else(|| "Could not find config directory".to_string())?;
    let matugen_css_path = config_dir.join("nuclear").join("matugen.css");
    Ok(matugen_css_path.to_string_lossy().to_string())
}

#[command]
pub fn read_matugen_css() -> Result<String, String> {
    let config_dir = dirs::config_dir()
        .ok_or_else(|| "Could not find config directory".to_string())?;
    let matugen_css_path = config_dir.join("nuclear").join("matugen.css");
    
    if !matugen_css_path.exists() {
        return Err("matugen.css not found".to_string());
    }
    
    fs::read_to_string(&matugen_css_path)
        .map_err(|e| format!("Failed to read matugen.css: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use zip::write::FileOptions;
    use zip::ZipWriter;

    fn create_test_zip(path: &Path, files: &[(&str, &[u8])]) {
        let file = File::create(path).unwrap();
        let mut zip = ZipWriter::new(file);
        let options: FileOptions<'_, ()> = FileOptions::default();

        for (name, content) in files {
            zip.start_file(*name, options).unwrap();
            zip.write_all(content).unwrap();
        }
        zip.finish().unwrap();
    }

    mod extract_zip {
        use super::*;
        use tempfile::tempdir;

        #[test]
        fn extracts_files() {
            let temp = tempdir().unwrap();
            let zip_path = temp.path().join("test.zip");
            let dest_path = temp.path().join("output");

            create_test_zip(
                &zip_path,
                &[
                    ("file1.txt", b"Content 1"),
                    ("file2.txt", b"Content 2"),
                    ("file3.txt", b"Content 3"),
                ],
            );

            extract_zip(zip_path, dest_path.clone()).unwrap();

            assert_eq!(
                fs::read_to_string(dest_path.join("file1.txt")).unwrap(),
                "Content 1"
            );
            assert_eq!(
                fs::read_to_string(dest_path.join("file2.txt")).unwrap(),
                "Content 2"
            );
            assert_eq!(
                fs::read_to_string(dest_path.join("file3.txt")).unwrap(),
                "Content 3"
            );
        }

        #[test]
        fn extracts_nested_directories() {
            let temp = tempdir().unwrap();
            let zip_path = temp.path().join("test.zip");
            let dest_path = temp.path().join("output");

            create_test_zip(
                &zip_path,
                &[
                    ("root.txt", b"root"),
                    ("sub/nested.txt", b"nested"),
                    ("sub/deep/file.txt", b"deep"),
                ],
            );

            extract_zip(zip_path, dest_path.clone()).unwrap();

            assert_eq!(
                fs::read_to_string(dest_path.join("root.txt")).unwrap(),
                "root"
            );
            assert_eq!(
                fs::read_to_string(dest_path.join("sub/nested.txt")).unwrap(),
                "nested"
            );
            assert_eq!(
                fs::read_to_string(dest_path.join("sub/deep/file.txt")).unwrap(),
                "deep"
            );
        }

        #[test]
        fn creates_destination_directory() {
            let temp = tempdir().unwrap();
            let zip_path = temp.path().join("test.zip");
            let dest_path = temp.path().join("new/nested/output");

            create_test_zip(&zip_path, &[("file.txt", b"content")]);

            assert!(!dest_path.exists());
            extract_zip(zip_path, dest_path.clone()).unwrap();
            assert!(dest_path.exists());
        }

        #[test]
        fn returns_error_for_nonexistent_zip() {
            let temp = tempdir().unwrap();
            let zip_path = temp.path().join("nonexistent.zip");
            let dest_path = temp.path().join("output");

            let result = extract_zip(zip_path, dest_path);

            assert!(result.is_err());
        }

        #[test]
        fn returns_error_for_invalid_zip() {
            let temp = tempdir().unwrap();
            let zip_path = temp.path().join("invalid.zip");
            let dest_path = temp.path().join("output");

            fs::write(&zip_path, b"not a zip file").unwrap();

            let result = extract_zip(zip_path, dest_path);

            assert!(result.is_err());
        }
    }
}

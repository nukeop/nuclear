use std::fs::{self, File};
use std::io::{BufReader, Read, Write};
use std::path::{Path, PathBuf};
use tauri::command;
use zip::ZipArchive;

// zip bomb limits - plugins and themes have no reason to be this large
const MAX_ZIP_ENTRIES: usize = 2000;
const MAX_ZIP_UNCOMPRESSED_BYTES: u64 = 200 * 1024 * 1024; // 200 MB total
const MAX_ZIP_SINGLE_FILE_BYTES: u64 = 100 * 1024 * 1024; // 100 MB per file

// 2 GB should be more than enough for yt-dlp or any plugin/theme
const MAX_DOWNLOAD_BYTES: u64 = 2 * 1024 * 1024 * 1024;

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
                // don't follow symlinks - a plugin dir could contain symlinks pointing
                // outside the app data directory and we don't want to follow those
                log::warn!(
                    "Skipping symlink at {:?} during recursive copy",
                    from_path
                );
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

        // bail early if the entry count looks unreasonable
        if archive.len() > MAX_ZIP_ENTRIES {
            return Err(format!(
                "ZIP has too many entries ({} > {})",
                archive.len(),
                MAX_ZIP_ENTRIES
            )
            .into());
        }

        let mut total_bytes: u64 = 0;

        for i in 0..archive.len() {
            let mut entry = archive.by_index(i)?;
            // mangled_name strips leading slashes and .. components - keeps zip slip out
            let out_path = dest_path.join(entry.mangled_name());

            if entry.is_dir() {
                fs::create_dir_all(&out_path)?;
            } else {
                if let Some(parent) = out_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                let mut out_file = File::create(&out_path)?;

                // manual loop so we can check per-file and total limits
                // don't trust the metadata size - zip files can lie about it
                let mut buf = [0u8; 65536];
                let mut file_bytes: u64 = 0;
                loop {
                    let n = entry.read(&mut buf)?;
                    if n == 0 {
                        break;
                    }
                    file_bytes += n as u64;
                    if file_bytes > MAX_ZIP_SINGLE_FILE_BYTES {
                        return Err(format!(
                            "single file in ZIP is too large (> {} bytes)",
                            MAX_ZIP_SINGLE_FILE_BYTES
                        )
                        .into());
                    }
                    out_file.write_all(&buf[..n])?;
                }

                total_bytes += file_bytes;
                if total_bytes > MAX_ZIP_UNCOMPRESSED_BYTES {
                    return Err(format!(
                        "total extracted size exceeds limit ({} bytes)",
                        MAX_ZIP_UNCOMPRESSED_BYTES
                    )
                    .into());
                }

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

// URL validation shared with http_fetch - only allow http/https and no loopback
fn validate_download_url(url: &str) -> Result<(), String> {
    let lower = url.to_lowercase();
    if !lower.starts_with("https://") && !lower.starts_with("http://") {
        return Err("download URL scheme not allowed - only http and https".to_string());
    }

    let without_scheme = &url[url.find("://").unwrap() + 3..];
    let authority = without_scheme
        .split(['/', '?', '#'])
        .next()
        .unwrap_or(without_scheme);

    let host = if authority.starts_with('[') {
        authority
            .trim_start_matches('[')
            .split(']')
            .next()
            .unwrap_or(authority)
    } else {
        authority.split(':').next().unwrap_or(authority)
    };

    if host.is_empty() {
        return Err("download URL has no host".to_string());
    }

    let lower_host = host.to_lowercase();
    let is_loopback = lower_host == "localhost"
        || lower_host == "::1"
        || lower_host == "0.0.0.0"
        || lower_host.starts_with("127.")
        || host
            .parse::<std::net::IpAddr>()
            .map(|ip| ip.is_loopback())
            .unwrap_or(false);

    if is_loopback {
        return Err("downloading from localhost is not allowed".to_string());
    }

    Ok(())
}

#[command]
pub async fn download_file(url: String, dest_path: PathBuf) -> Result<(), String> {
    use std::time::Duration;
    use tokio::io::AsyncWriteExt;

    validate_download_url(&url).map_err(|e| format!("invalid download URL: {e}"))?;

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
        let mut downloaded: u64 = 0;

        use futures::StreamExt;
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            downloaded += chunk.len() as u64;
            if downloaded > MAX_DOWNLOAD_BYTES {
                return Err(format!(
                    "download exceeds size limit ({} bytes)",
                    MAX_DOWNLOAD_BYTES
                )
                .into());
            }
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

    mod validate_download_url {
        use super::*;

        #[test]
        fn allows_https() {
            assert!(validate_download_url("https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp").is_ok());
        }

        #[test]
        fn blocks_localhost() {
            assert!(validate_download_url("http://localhost:8080/evil").is_err());
        }

        #[test]
        fn blocks_loopback_ip() {
            assert!(validate_download_url("http://127.0.0.1/evil").is_err());
        }

        #[test]
        fn blocks_file_scheme() {
            assert!(validate_download_url("file:///etc/passwd").is_err());
        }
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

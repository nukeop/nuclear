use log::{debug, error, info};
use std::fs;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager};

const RELEASE_BASE_URL: &str = "https://github.com/yt-dlp/yt-dlp/releases/latest/download";

fn release_filename() -> &'static str {
    #[cfg(target_os = "macos")]
    {
        "yt-dlp_macos.zip"
    }
    #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    {
        "yt-dlp_linux.zip"
    }
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    {
        "yt-dlp_linux_aarch64.zip"
    }
    #[cfg(all(target_os = "windows", target_arch = "x86_64"))]
    {
        "yt-dlp_win.zip"
    }
    #[cfg(all(target_os = "windows", target_arch = "aarch64"))]
    {
        "yt-dlp_win_arm64.zip"
    }
}

fn binary_name() -> &'static str {
    #[cfg(target_os = "macos")]
    {
        "yt-dlp_macos"
    }
    #[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    {
        "yt-dlp_linux"
    }
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    {
        "yt-dlp_linux_aarch64"
    }
    #[cfg(all(target_os = "windows", target_arch = "x86_64"))]
    {
        "yt-dlp.exe"
    }
    #[cfg(all(target_os = "windows", target_arch = "aarch64"))]
    {
        "yt-dlp_win_arm64.exe"
    }
}

fn ytdlp_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
    app_handle
        .path()
        .app_data_dir()
        .map(|dir| dir.join("ytdlp"))
        .map_err(|error| format!("Failed to resolve app data directory: {}", error))
}

async fn download_zip(url: &str, dest: &PathBuf) -> Result<(), String> {
    use futures::StreamExt;
    use std::time::Duration;
    use tokio::io::AsyncWriteExt;

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(300))
        .connect_timeout(Duration::from_secs(30))
        .build()
        .map_err(|error| format!("HTTP client error: {}", error))?;

    let response = client
        .get(url)
        .send()
        .await
        .map_err(|error| format!("Download failed: {}", error))?;

    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }

    let mut file = tokio::fs::File::create(dest)
        .await
        .map_err(|error| format!("Failed to create file: {}", error))?;

    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|error| format!("Download stream error: {}", error))?;
        file.write_all(&chunk)
            .await
            .map_err(|error| format!("Write error: {}", error))?;
    }

    info!("[yt-dlp] Downloaded {} to {:?}", url, dest);
    Ok(())
}

fn extract_zip(zip_path: &std::path::Path, dest: &std::path::Path) -> Result<(), String> {
    use std::io::BufReader;
    use zip::ZipArchive;

    let file =
        fs::File::open(zip_path).map_err(|error| format!("Failed to open zip: {}", error))?;
    let mut archive =
        ZipArchive::new(BufReader::new(file)).map_err(|error| format!("Invalid zip: {}", error))?;

    for i in 0..archive.len() {
        let mut entry = archive
            .by_index(i)
            .map_err(|error| format!("Zip entry error: {}", error))?;
        let out_path = dest.join(entry.mangled_name());

        if entry.is_dir() {
            fs::create_dir_all(&out_path)
                .map_err(|error| format!("Failed to create dir: {}", error))?;
        } else {
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|error| format!("Failed to create parent dir: {}", error))?;
            }
            let mut out_file = fs::File::create(&out_path)
                .map_err(|error| format!("Failed to create file: {}", error))?;
            std::io::copy(&mut entry, &mut out_file)
                .map_err(|error| format!("Failed to extract file: {}", error))?;

            #[cfg(unix)]
            if let Some(mode) = entry.unix_mode() {
                use std::os::unix::fs::PermissionsExt;
                fs::set_permissions(&out_path, fs::Permissions::from_mode(mode)).ok();
            }
        }
    }

    info!("[yt-dlp] Extracted {:?} to {:?}", zip_path, dest);
    Ok(())
}

#[command]
pub async fn ytdlp_ensure_installed(app_handle: AppHandle) -> Result<bool, String> {
    let ytdlp_dir = ytdlp_dir(&app_handle)?;
    let binary_path = ytdlp_dir.join(binary_name());

    if binary_path.exists() {
        let path_str = binary_path
            .to_str()
            .ok_or("Invalid path encoding")?
            .to_string();
        crate::ytdlp::set_ytdlp_path(path_str);
        debug!("[yt-dlp] Already installed at {:?}", binary_path);
        return Ok(true);
    }

    info!("[yt-dlp] Not found, downloading...");

    let download_url = format!("{}/{}", RELEASE_BASE_URL, release_filename());
    let zip_path = ytdlp_dir.join(".download.zip");

    fs::create_dir_all(&ytdlp_dir)
        .map_err(|error| format!("Failed to create ytdlp dir: {}", error))?;

    let download_result = download_zip(&download_url, &zip_path).await;
    if let Err(ref err) = download_result {
        fs::remove_file(&zip_path).ok();
        error!("[yt-dlp] Download failed: {}", err);
        return Err(err.clone());
    }

    let zip_path_clone = zip_path.clone();
    let ytdlp_dir_clone = ytdlp_dir.clone();
    let extract_result =
        tokio::task::spawn_blocking(move || extract_zip(&zip_path_clone, &ytdlp_dir_clone))
            .await
            .map_err(|error| format!("Extract task failed: {}", error))?;

    fs::remove_file(&zip_path).ok();

    extract_result?;

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&binary_path, fs::Permissions::from_mode(0o755))
            .map_err(|error| format!("Failed to set permissions: {}", error))?;
    }

    if !binary_path.exists() {
        return Err(format!(
            "Binary not found after extraction: {:?}",
            binary_path
        ));
    }

    let path_str = binary_path
        .to_str()
        .ok_or("Invalid path encoding")?
        .to_string();
    crate::ytdlp::set_ytdlp_path(path_str);
    info!("[yt-dlp] Installed to {:?}", binary_path);

    Ok(false)
}

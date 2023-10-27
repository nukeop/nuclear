mod error;
mod js;
mod local_track;
use error::ScannerError;
use id3::{Tag, TagLike};
use js::{set_optional_field_str, set_optional_field_u32};
use neon::prelude::*;
use std::collections::LinkedList;
use uuid::Uuid;

use local_track::LocalTrack;

fn visitFile(path: String) -> Result<LocalTrack, ScannerError> {
    let tag = Tag::read_from_path(&path);

    match tag {
        Ok(tag) => Ok(LocalTrack {
            uuid: Uuid::new_v4().to_string(),
            artist: tag.artist().map(|s| s.to_string()),
            title: tag.title().map(|s| s.to_string()),
            album: tag.album().map(|s| s.to_string()),
            duration: tag.duration().unwrap_or(0),
            position: tag.track(),
            year: tag.year().map(|s| s as u32),
            filename: path.split("/").last().map(|s| s.to_string()).unwrap(),
            path: path.clone(),
        }),
        Err(e) => Err(ScannerError {
            message: format!("Error reading file: {}", e),
        }),
    }
}

fn visitDirectory(
    path: String,
    supportedFormats: Vec<String>,
    dirsToScanQueue: &mut LinkedList<String>,
    filesToScanQueue: &mut LinkedList<String>,
) {
    // Read the contents of the directory
    let dir = std::fs::read_dir(path.clone()).unwrap();
    for entry in dir {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_dir() {
            // Add the directory to the queue
            dirsToScanQueue.push_back(path.to_str().unwrap().to_string());
        } else if let Some(extension) = path.extension().and_then(|ext| ext.to_str()) {
            // Add the file to the queue, if it's a supported format
            if supportedFormats.contains(&extension.to_string()) {
                filesToScanQueue.push_back(path.to_str().unwrap().to_string());
            }
        }
    }
}

fn scanFolders(mut cx: FunctionContext) -> JsResult<JsArray> {
    let folders: Handle<JsArray> = cx.argument(0)?;
    let supported_formats: Handle<JsArray> = cx.argument(1)?;
    let onProgressCallback: Handle<JsFunction> = cx.argument(2)?;
    let result: Handle<JsArray> = cx.empty_array();

    // Copy all the starting folders to a queue, which holds all the folders left to scan
    let supported_formats_vec = supported_formats
        .to_vec(&mut cx)?
        .into_iter()
        .map(|format| format.to_string(&mut cx).unwrap().value(&mut cx))
        .collect::<Vec<String>>();
    let folders_vec = folders.to_vec(&mut cx)?;
    let mut dirs_to_scan_queue: LinkedList<String> = LinkedList::new();
    let mut files_to_scan_queue: LinkedList<String> = LinkedList::new();
    let mut total_files_to_scan_num;
    for folder in folders_vec {
        let folder_string = folder.to_string(&mut cx)?.value(&mut cx);
        dirs_to_scan_queue.push_back(folder_string);
    }

    // While there are still folders left to scan
    while !dirs_to_scan_queue.is_empty() {
        // Get the next folder to scan
        let folder = dirs_to_scan_queue.pop_front().unwrap();

        // Scan the folder
        visitDirectory(
            folder.clone(),
            supported_formats_vec.clone(),
            &mut dirs_to_scan_queue,
            &mut files_to_scan_queue,
        );

        // Call the progress callback
        let this = cx.undefined();
        let args = vec![
            cx.number(0).upcast(),
            cx.number(files_to_scan_queue.len() as f64).upcast(),
            cx.string(folder.clone()).upcast(),
        ];
        onProgressCallback.call(&mut cx, this, args)?;
    }

    // All folders have been scanned, now scan the files
    total_files_to_scan_num = files_to_scan_queue.len();
    while !files_to_scan_queue.is_empty() {
        // Get the next file to scan
        let file = files_to_scan_queue.pop_front().unwrap();

        // Scan the file
        let track = visitFile(file.clone()).unwrap();
        let len = result.len(&mut cx);
        let mut track_js_object = JsObject::new(&mut cx);
        let track_uuid_js_string = cx.string(track.uuid);
        track_js_object.set(&mut cx, "uuid", track_uuid_js_string)?;

        set_optional_field_str(&mut cx, &mut track_js_object, "artist", track.artist);

        set_optional_field_str(&mut cx, &mut track_js_object, "title", track.title);

        set_optional_field_str(&mut cx, &mut track_js_object, "album", track.album);

        let track_duration_js_number = cx.number(track.duration);
        track_js_object.set(&mut cx, "duration", track_duration_js_number)?;

        set_optional_field_u32(&mut cx, &mut track_js_object, "position", track.position);

        set_optional_field_u32(&mut cx, &mut track_js_object, "year", track.year);

        let track_filename_js_string = cx.string(track.filename);
        track_js_object.set(&mut cx, "filename", track_filename_js_string)?;

        let track_path_js_string = cx.string(track.path);
        track_js_object.set(&mut cx, "path", track_path_js_string)?;

        let track_local = cx.boolean(true);
        track_js_object.set(&mut cx, "local", track_local)?;

        result.set(&mut cx, len, track_js_object)?;

        // Call the progress callback
        let this = cx.undefined();
        let args = vec![
            cx.number((total_files_to_scan_num - files_to_scan_queue.len()) as f64)
                .upcast(),
            cx.number(total_files_to_scan_num as f64).upcast(),
            cx.string(file.clone()).upcast(),
        ];
        onProgressCallback.call(&mut cx, this, args)?;
    }

    Ok(result)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("scanFolders", scanFolders)?;
    Ok(())
}

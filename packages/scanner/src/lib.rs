#![forbid(unsafe_code)]

mod error;
mod js;
mod local_track;
mod metadata;
mod profiling;
mod scanner;
mod thumbnails;
use error::ScannerError;

use js::set_properties_from_metadata;
use local_track::LocalTrack;
use neon::prelude::*;
use scanner::{extractor_from_path, visit_directory, visit_file};
use std::collections::LinkedList;
use thumbnails::create_thumbnails_dir;

fn handle_progress<'a>(
    cx: &mut FunctionContext<'a>,
    total_files_to_scan_num: usize,
    index: usize,
    filename: String,
    on_progress_callback: Handle<JsFunction>,
) -> JsResult<'a, JsValue> {
    let js_this = cx.undefined();
    let args = vec![
        cx.number(index as f64).upcast(),
        cx.number(total_files_to_scan_num as f64).upcast(),
        cx.string(filename.clone()).upcast(),
    ];
    on_progress_callback.call(cx, js_this, args)
}

fn handle_error<'a>(
    cx: &mut FunctionContext<'a>,
    error: &ScannerError,
    on_error_callback: Handle<JsFunction>,
) -> JsResult<'a, JsValue> {
    let js_this = cx.undefined();
    let on_error_args = vec![
        cx.string(error.path.clone()).upcast(),
        cx.string(error.message.clone()).upcast(),
    ];
    on_error_callback.call(cx, js_this, on_error_args)
}

fn scan_folders(mut cx: FunctionContext) -> JsResult<JsArray> {
    let folders: Handle<JsArray> = cx.argument(0)?;
    let supported_formats: Handle<JsArray> = cx.argument(1)?;
    let thumbnails_dir: Handle<JsString> = cx.argument(2)?;
    let thumbnails_dir_str = thumbnails_dir.value(&mut cx);
    let on_progress_callback: Handle<JsFunction> = cx.argument(3)?;
    let on_error_callback: Handle<JsFunction> = cx.argument(4)?;
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
    let total_files_to_scan_num;
    for folder in folders_vec {
        let folder_string = folder.to_string(&mut cx)?.value(&mut cx);
        dirs_to_scan_queue.push_back(folder_string);
    }

    // While there are still folders left to scan
    while !dirs_to_scan_queue.is_empty() {
        // Get the next folder to scan
        let folder = dirs_to_scan_queue.pop_front().unwrap();

        // Scan the folder
        visit_directory(
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
        on_progress_callback.call(&mut cx, this, args)?;
    }

    // First, create a directory for thumbnails
    create_thumbnails_dir(thumbnails_dir_str.as_str()).unwrap();

    // All directories have been scanned, now scan the files
    total_files_to_scan_num = files_to_scan_queue.len();

    let scanned_local_tracks: Vec<Result<LocalTrack, ScannerError>> = files_to_scan_queue
        .iter()
        .enumerate()
        .map(|(index, file)| {
            let result = visit_file(
                file.clone(),
                extractor_from_path,
                thumbnails_dir_str.as_str(),
            );

            // Send progress back to JS
            handle_progress(
                &mut cx,
                total_files_to_scan_num,
                index,
                file.clone(),
                on_progress_callback.clone(),
            )
            .unwrap();
            return result;
        })
        .collect();

    scanned_local_tracks.iter().for_each(|track| match track {
        Ok(track) => {
            let len = result.len(&mut cx);
            let mut track_js_object = JsObject::new(&mut cx);
            let track_uuid_js_string = cx.string(track.uuid.clone());
            track_js_object
                .set(&mut cx, "uuid", track_uuid_js_string)
                .unwrap();

            set_properties_from_metadata(&mut cx, &mut track_js_object, &track.metadata);

            let track_filename_js_string = cx.string(track.filename.clone());
            track_js_object
                .set(&mut cx, "filename", track_filename_js_string)
                .unwrap();

            let track_path_js_string = cx.string(track.path.clone());
            track_js_object
                .set(&mut cx, "path", track_path_js_string)
                .unwrap();

            let track_local = cx.boolean(true);
            track_js_object.set(&mut cx, "local", track_local).unwrap();

            result.set(&mut cx, len, track_js_object).unwrap();
        }
        Err(error) => {
            handle_error(&mut cx, error, on_error_callback.clone()).unwrap();
        }
    });

    Ok(result)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("scanFolders", scan_folders)?;
    Ok(())
}

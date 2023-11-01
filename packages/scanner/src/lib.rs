mod error;
mod js;
mod local_track;
mod scanner;
use id3::Tag;
use js::{set_optional_field_buffer, set_optional_field_str, set_optional_field_u32};
use neon::prelude::*;
use scanner::{visit_directory, visit_file};
use std::collections::LinkedList;

fn scan_folders(mut cx: FunctionContext) -> JsResult<JsArray> {
    let folders: Handle<JsArray> = cx.argument(0)?;
    let supported_formats: Handle<JsArray> = cx.argument(1)?;
    let on_progress_callback: Handle<JsFunction> = cx.argument(2)?;
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

    // All folders have been scanned, now scan the files
    total_files_to_scan_num = files_to_scan_queue.len();
    while !files_to_scan_queue.is_empty() {
        // Get the next file to scan
        let file = files_to_scan_queue.pop_front().unwrap();

        // Scan the file
        let track = visit_file(file.clone(), |path| Tag::read_from_path(path));

        if track.is_err() {
            // Call the progress callback
            let this = cx.undefined();
            let args = vec![
                cx.number((total_files_to_scan_num - files_to_scan_queue.len()) as f64)
                    .upcast(),
                cx.number(total_files_to_scan_num as f64).upcast(),
                cx.string(file.clone()).upcast(),
            ];
            on_progress_callback.call(&mut cx, this, args)?;

            continue;
        }

        let track = track.unwrap();

        let len = result.len(&mut cx);
        let mut track_js_object = JsObject::new(&mut cx);
        let track_uuid_js_string = cx.string(track.uuid);
        track_js_object.set(&mut cx, "uuid", track_uuid_js_string)?;

        set_optional_field_str(&mut cx, &mut track_js_object, "artist", track.artist);
        set_optional_field_str(&mut cx, &mut track_js_object, "title", track.title);
        set_optional_field_str(&mut cx, &mut track_js_object, "album", track.album);

        let track_duration_js_number = cx.number(track.duration);
        track_js_object.set(&mut cx, "duration", track_duration_js_number)?;

        set_optional_field_buffer(&mut cx, &mut track_js_object, "thumbnail", track.thumbnail);

        set_optional_field_u32(&mut cx, &mut track_js_object, "position", track.position);
        set_optional_field_u32(&mut cx, &mut track_js_object, "disc", track.disc);
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
        on_progress_callback.call(&mut cx, this, args)?;
    }

    Ok(result)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("scanFolders", scan_folders)?;
    Ok(())
}

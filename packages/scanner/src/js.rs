use neon::prelude::*;

use crate::metadata::AudioMetadata;

pub fn set_optional_field_str(
    cx: &mut FunctionContext,
    obj: &mut Handle<JsObject>,
    field_name: &str,
    value: Option<String>,
) {
    match value {
        Some(v) => {
            let field_value = cx.string(&v);
            obj.set(cx, field_name, field_value).unwrap();
        }
        None => {
            let undefined = cx.undefined();
            obj.set(cx, field_name, undefined).unwrap();
        }
    }
}

pub fn set_optional_field_u32(
    cx: &mut FunctionContext,
    obj: &mut Handle<JsObject>,
    field_name: &str,
    value: Option<u32>,
) {
    match value {
        Some(v) => {
            let field_value = cx.number(v as f64);
            obj.set(cx, field_name, field_value).unwrap();
        }
        None => {
            let undefined = cx.undefined();
            obj.set(cx, field_name, undefined).unwrap();
        }
    }
}

pub fn set_optional_field_buffer(
    cx: &mut FunctionContext,
    obj: &mut Handle<JsObject>,
    field_name: &str,
    value: Option<Vec<u8>>,
) {
    match value {
        Some(v) => {
            let field_value = JsBuffer::external(cx, v);
            obj.set(cx, field_name, field_value).unwrap();
        }
        None => {
            let undefined = cx.undefined();
            obj.set(cx, field_name, undefined).unwrap();
        }
    }
}

pub fn set_properties_from_metadata(
    cx: &mut FunctionContext,
    obj: &mut Handle<JsObject>,
    metadata: &AudioMetadata,
) {
    set_optional_field_str(cx, obj, "artist", metadata.artist.clone());
    set_optional_field_str(cx, obj, "title", metadata.title.clone());
    set_optional_field_str(cx, obj, "album", metadata.album.clone());

    set_optional_field_u32(cx, obj, "duration", metadata.duration);
    set_optional_field_str(cx, obj, "thumbnail", metadata.thumbnail.clone());
    set_optional_field_u32(cx, obj, "position", metadata.position);
    set_optional_field_u32(cx, obj, "disc", metadata.disc);
    set_optional_field_str(cx, obj, "year", metadata.year.clone());
}

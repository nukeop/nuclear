use neon::prelude::*;

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

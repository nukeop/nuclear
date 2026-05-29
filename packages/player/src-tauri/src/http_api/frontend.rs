use axum::{
    body::Body,
    http::{header::CONTENT_TYPE, HeaderValue, StatusCode, Uri},
    response::{IntoResponse, Response},
};
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "../dist/"]
struct FrontendAssets;

// Hack that lets Nuclear serve the Nuclear Jam frontend from the same files
// as the normal UI

pub(super) async fn serve_frontend(uri: Uri) -> impl IntoResponse {
    let path = uri.path().trim_start_matches('/');
    let path = if path.is_empty() { "index.html" } else { path };
    serve_file(path)
}

fn serve_file(path: &str) -> Response {
    match FrontendAssets::get(path) {
        Some(content) => {
            let mime = mime_guess::from_path(path).first_or_octet_stream();
            Response::builder()
                .status(StatusCode::OK)
                .header(CONTENT_TYPE, HeaderValue::from_str(mime.as_ref()).unwrap())
                .body(Body::from(content.data.into_owned()))
                .unwrap()
        }
        None => match FrontendAssets::get("index.html") {
            Some(index) => Response::builder()
                .status(StatusCode::OK)
                .header(CONTENT_TYPE, HeaderValue::from_static("text/html"))
                .body(Body::from(index.data.into_owned()))
                .unwrap(),
            None => Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(Body::from("404 Not Found"))
                .unwrap(),
        },
    }
}

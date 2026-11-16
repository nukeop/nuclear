use std::time::Duration;

use serde_json::{json, Value};

use crate::bridge::bridge::Bridge;
use crate::mpd::protocol::{
    BinaryResponse, MpdError, ACK_ERROR_ARG, ACK_ERROR_NO_EXIST, ACK_ERROR_SYSTEM,
};

use super::call;
use super::queue::file_uri;

#[derive(Default)]
pub struct AlbumArt {
    cached: Option<(String, Vec<u8>)>,
}

impl AlbumArt {
    pub async fn chunk(
        &mut self,
        bridge: &Bridge,
        uri: &str,
        offset: usize,
    ) -> Result<BinaryResponse, MpdError> {
        let image = self.image(bridge, uri).await?;
        if offset > image.len() {
            return Err(error(ACK_ERROR_ARG, "Offset too large"));
        }
        let end = (offset + 8192).min(image.len());
        Ok(BinaryResponse {
            size: image.len(),
            data: image[offset..end].to_vec(),
        })
    }

    async fn image(&mut self, bridge: &Bridge, uri: &str) -> Result<&[u8], MpdError> {
        let entry = match self.cached.take() {
            Some((cached_uri, image)) if cached_uri == uri => (cached_uri, image),
            _ => (uri.to_string(), fetch_image(bridge, uri).await?),
        };
        let (_, image) = self.cached.insert(entry);
        Ok(image)
    }
}

async fn fetch_image(bridge: &Bridge, uri: &str) -> Result<Vec<u8>, MpdError> {
    let queue = call(bridge, "albumart", "Queue.getQueue", json!({})).await?;
    let url =
        artwork_url(&queue, uri).ok_or_else(|| error(ACK_ERROR_NO_EXIST, "No file exists"))?;
    let response = reqwest::Client::new()
        .get(url)
        .timeout(Duration::from_secs(10))
        .send()
        .await
        .and_then(|response| response.error_for_status())
        .map_err(|err| error(ACK_ERROR_SYSTEM, &err.to_string()))?;
    let bytes = response
        .bytes()
        .await
        .map_err(|err| error(ACK_ERROR_SYSTEM, &err.to_string()))?;
    Ok(bytes.to_vec())
}

fn artwork_url<'a>(queue: &'a Value, uri: &str) -> Option<&'a str> {
    let item = queue["items"]
        .as_array()?
        .iter()
        .find(|item| file_uri(&item["track"]) == uri)?;
    let artworks = item["track"]["artwork"]["items"].as_array()?;
    let with_url = || artworks.iter().filter(|artwork| artwork["url"].is_string());
    let cover = with_url()
        .find(|artwork| matches!(artwork["purpose"].as_str(), None | Some("cover")))
        .or_else(|| with_url().next())?;
    cover["url"].as_str()
}

fn error(code: u32, message: &str) -> MpdError {
    MpdError {
        code,
        command: "albumart".to_string(),
        list_index: 0,
        message: message.to_string(),
    }
}

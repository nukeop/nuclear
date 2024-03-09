use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub struct ScannerError {
    pub message: String,
    pub path: String,
}

impl Error for ScannerError {}

impl ScannerError {
    pub fn new(message: &str, path: &str) -> ScannerError {
        ScannerError {
            message: message.to_string(),
            path: path.to_string(),
        }
    }
}

impl fmt::Display for ScannerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ScannerError: {}", self.message)
    }
}

#[derive(Debug)]
pub struct MetadataError {
    pub message: String,
}

impl MetadataError {
    pub fn new(message: &str) -> MetadataError {
        MetadataError {
            message: message.to_string(),
        }
    }
}

impl Error for MetadataError {}

impl fmt::Display for MetadataError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "MetadataError: {}", self.message)
    }
}

#[derive(Debug)]
pub struct ThumbnailError {
    pub message: String,
}

impl Error for ThumbnailError {}

impl fmt::Display for ThumbnailError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ThumbnailError: {}", self.message)
    }
}

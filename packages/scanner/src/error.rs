use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub struct ScannerError {
    pub message: String,
}

impl Error for ScannerError {}

impl fmt::Display for ScannerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ScannerError: {}", self.message)
    }
}

use log::debug;
use pgp::composed::{Deserializable, DetachedSignature, SignedPublicKey};
use std::fmt;

pub const YTDLP_PUBLIC_KEY: &str = include_str!("../keys/yt-dlp.asc");

#[derive(Debug, PartialEq, Eq)]
pub enum MalformedInput {
    PublicKey,
    Signature,
    Sums,
}

#[derive(Debug, PartialEq, Eq)]
pub enum VerifyError {
    BadSignature,
    MissingFromSums(String),
    HashMismatch { expected: String, actual: String },
    Malformed(MalformedInput),
}

impl fmt::Display for MalformedInput {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MalformedInput::PublicKey => write!(formatter, "public key"),
            MalformedInput::Signature => write!(formatter, "signature"),
            MalformedInput::Sums => write!(formatter, "checksum file"),
        }
    }
}

impl fmt::Display for VerifyError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            VerifyError::BadSignature => write!(formatter, "checksum file signature is not valid"),
            VerifyError::MissingFromSums(filename) => {
                write!(formatter, "{} is not listed in the checksum file", filename)
            }
            VerifyError::HashMismatch { expected, actual } => write!(
                formatter,
                "checksum mismatch: expected {}, got {}",
                expected, actual
            ),
            VerifyError::Malformed(input) => write!(formatter, "malformed {}", input),
        }
    }
}

pub fn verify_sums(
    sums: &[u8],
    signature: &[u8],
    filename: &str,
    public_key: &str,
) -> Result<String, VerifyError> {
    verify_signature(sums, signature, public_key)?;
    listed_hash(sums, filename)
}

pub fn verify_hash(expected: &str, actual: &str) -> Result<(), VerifyError> {
    if actual != expected {
        return Err(VerifyError::HashMismatch {
            expected: expected.to_string(),
            actual: actual.to_string(),
        });
    }

    Ok(())
}

fn malformed(input: MalformedInput) -> impl FnOnce(pgp::errors::Error) -> VerifyError {
    move |error| {
        debug!("[yt-dlp] Could not parse {}: {}", input, error);
        VerifyError::Malformed(input)
    }
}

fn verify_signature(sums: &[u8], signature: &[u8], public_key: &str) -> Result<(), VerifyError> {
    let (key, _headers) =
        SignedPublicKey::from_string(public_key).map_err(malformed(MalformedInput::PublicKey))?;
    let signature =
        DetachedSignature::from_bytes(signature).map_err(malformed(MalformedInput::Signature))?;

    signature
        .verify(&key.primary_key, sums)
        .map_err(|_| VerifyError::BadSignature)
}

fn listed_hash(sums: &[u8], filename: &str) -> Result<String, VerifyError> {
    let sums =
        std::str::from_utf8(sums).map_err(|_| VerifyError::Malformed(MalformedInput::Sums))?;

    sums.lines()
        .filter_map(|line| line.split_once("  "))
        .find(|(_, listed_filename)| *listed_filename == filename)
        .map(|(hash, _)| hash.to_string())
        .ok_or_else(|| VerifyError::MissingFromSums(filename.to_string()))
}

#[cfg(test)]
#[path = "ytdlp_verify.fixtures.rs"]
mod fixtures;

#[cfg(test)]
#[path = "ytdlp_verify.test.rs"]
mod tests;

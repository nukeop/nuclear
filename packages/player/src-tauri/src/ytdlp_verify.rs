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
mod tests {
    use super::*;
    use pgp::composed::{ArmorOptions, KeyType, SecretKeyParamsBuilder, SignedSecretKey};
    use pgp::crypto::hash::HashAlgorithm;
    use pgp::ser::Serialize;
    use pgp::types::Password;
    use sha2::{Digest, Sha256};

    const ZIP_NAME: &str = "yt-dlp_linux.zip";
    const OTHER_ZIP_NAME: &str = "yt-dlp_macos.zip";
    const RELEASE_ZIP: &[u8] = b"yt-dlp release zip";
    const ATTACKER_ZIP: &[u8] = b"attacker's zip";
    const REAL_SUMS: &[u8] = include_bytes!("../fixtures/ytdlp_verify/real/SHA2-256SUMS");
    const REAL_SIGNATURE: &[u8] = include_bytes!("../fixtures/ytdlp_verify/real/SHA2-256SUMS.sig");

    struct SignedRelease {
        sums: Vec<u8>,
        signature: Vec<u8>,
        public_key: String,
    }

    struct SignedReleaseBuilder {
        entries: Vec<(String, String)>,
    }

    impl SignedReleaseBuilder {
        fn new() -> Self {
            Self {
                entries: Vec::new(),
            }
        }

        fn with_entry(mut self, filename: &str, hash: &str) -> Self {
            self.entries.push((filename.to_string(), hash.to_string()));
            self
        }

        fn sums(&self) -> Vec<u8> {
            self.entries
                .iter()
                .map(|(filename, hash)| format!("{}  {}\n", hash, filename))
                .collect::<String>()
                .into_bytes()
        }

        fn build(self) -> SignedRelease {
            let key = generate_key();
            let sums = self.sums();

            SignedRelease {
                signature: sign(&key, &sums),
                public_key: key
                    .to_public_key()
                    .to_armored_string(ArmorOptions::default())
                    .unwrap(),
                sums,
            }
        }
    }

    fn generate_key() -> SignedSecretKey {
        SecretKeyParamsBuilder::default()
            .key_type(KeyType::Ed25519)
            .can_certify(true)
            .can_sign(true)
            .primary_user_id("Test Signer <signer@test.invalid>".into())
            .build()
            .unwrap()
            .generate(rand::thread_rng())
            .unwrap()
    }

    fn sign(key: &SignedSecretKey, data: &[u8]) -> Vec<u8> {
        DetachedSignature::sign_binary_data(
            rand::thread_rng(),
            &key.primary_key,
            &Password::empty(),
            HashAlgorithm::Sha256,
            data,
        )
        .unwrap()
        .to_bytes()
        .unwrap()
    }

    fn sha256_hex(bytes: &[u8]) -> String {
        Sha256::digest(bytes)
            .iter()
            .map(|byte| format!("{:02x}", byte))
            .collect()
    }

    fn verify_zip(release: &SignedRelease, zip: &[u8]) -> Result<(), VerifyError> {
        let expected = verify_sums(
            &release.sums,
            &release.signature,
            ZIP_NAME,
            &release.public_key,
        )?;
        verify_hash(&expected, &sha256_hex(zip))
    }

    #[test]
    fn returns_the_hash_listed_for_the_file_in_correctly_signed_sums() {
        let release = SignedReleaseBuilder::new()
            .with_entry(OTHER_ZIP_NAME, &"a".repeat(64))
            .with_entry(ZIP_NAME, &"b".repeat(64))
            .build();

        let result = verify_sums(
            &release.sums,
            &release.signature,
            ZIP_NAME,
            &release.public_key,
        );

        assert_eq!(result, Ok("b".repeat(64)));
    }

    #[test]
    fn accepts_a_zip_whose_hash_matches_correctly_signed_sums() {
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .build();

        let result = verify_zip(&release, RELEASE_ZIP);

        assert_eq!(result, Ok(()));
    }

    #[test]
    fn rejects_a_zip_whose_hash_differs_from_correctly_signed_sums() {
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .build();

        let result = verify_zip(&release, ATTACKER_ZIP);

        assert_eq!(
            result,
            Err(VerifyError::HashMismatch {
                expected: sha256_hex(RELEASE_ZIP),
                actual: sha256_hex(ATTACKER_ZIP),
            })
        );
    }

    #[test]
    fn rejects_sums_rewritten_to_match_an_attackers_zip() {
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .build();
        let forged = SignedRelease {
            sums: SignedReleaseBuilder::new()
                .with_entry(ZIP_NAME, &sha256_hex(ATTACKER_ZIP))
                .sums(),
            ..release
        };

        let result = verify_zip(&forged, ATTACKER_ZIP);

        assert_eq!(result, Err(VerifyError::BadSignature));
    }

    #[test]
    fn rejects_sums_signed_by_a_different_key() {
        let trusted = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .build();
        let forged = SignedRelease {
            public_key: trusted.public_key,
            ..SignedReleaseBuilder::new()
                .with_entry(ZIP_NAME, &sha256_hex(ATTACKER_ZIP))
                .build()
        };

        let result = verify_zip(&forged, ATTACKER_ZIP);

        assert_eq!(result, Err(VerifyError::BadSignature));
    }

    #[test]
    fn rejects_a_file_missing_from_sums() {
        let release = SignedReleaseBuilder::new()
            .with_entry(OTHER_ZIP_NAME, &"a".repeat(64))
            .with_entry(ZIP_NAME, &"b".repeat(64))
            .build();

        let result = verify_sums(
            &release.sums,
            &release.signature,
            "yt-dlp_win.zip",
            &release.public_key,
        );

        assert_eq!(
            result,
            Err(VerifyError::MissingFromSums("yt-dlp_win.zip".to_string()))
        );
    }

    #[test]
    fn rejects_a_filename_that_only_partially_matches_a_sums_entry() {
        let release = SignedReleaseBuilder::new()
            .with_entry(OTHER_ZIP_NAME, &"a".repeat(64))
            .with_entry(ZIP_NAME, &"b".repeat(64))
            .build();

        let result = verify_sums(
            &release.sums,
            &release.signature,
            "linux.zip",
            &release.public_key,
        );

        assert_eq!(
            result,
            Err(VerifyError::MissingFromSums("linux.zip".to_string()))
        );
    }

    #[test]
    fn rejects_a_signature_that_is_not_openpgp() {
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &"a".repeat(64))
            .build();

        let result = verify_sums(
            &release.sums,
            b"not a signature",
            ZIP_NAME,
            &release.public_key,
        );

        assert_eq!(
            result,
            Err(VerifyError::Malformed(MalformedInput::Signature))
        );
    }

    #[test]
    fn rejects_a_public_key_that_is_not_openpgp() {
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &"a".repeat(64))
            .build();

        let result = verify_sums(
            &release.sums,
            &release.signature,
            ZIP_NAME,
            "not a public key",
        );

        assert_eq!(
            result,
            Err(VerifyError::Malformed(MalformedInput::PublicKey))
        );
    }

    #[test]
    fn embedded_ytdlp_key_verifies_a_real_ytdlp_release() {
        let result = verify_sums(
            REAL_SUMS,
            REAL_SIGNATURE,
            "yt-dlp_macos.zip",
            YTDLP_PUBLIC_KEY,
        );

        assert_eq!(
            result,
            Ok("0571d12722bd0affc5919bf8210f84d5707375661c8fa198bedec9f83f5266db".to_string())
        );
    }
}

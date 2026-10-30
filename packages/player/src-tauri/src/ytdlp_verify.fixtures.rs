use super::{verify_hash, verify_sums, VerifyError};
use pgp::composed::{
    ArmorOptions, DetachedSignature, KeyType, SecretKeyParamsBuilder, SignedSecretKey,
};
use pgp::crypto::hash::HashAlgorithm;
use pgp::ser::Serialize;
use pgp::types::Password;
use sha2::{Digest, Sha256};

pub const ZIP_NAME: &str = "yt-dlp_linux.zip";
pub const OTHER_ZIP_NAME: &str = "yt-dlp_macos.zip";
pub const RELEASE_ZIP: &[u8] = b"yt-dlp release zip";
pub const ATTACKER_ZIP: &[u8] = b"attacker's zip";
pub const REAL_SUMS: &[u8] = include_bytes!("../fixtures/ytdlp_verify/real/SHA2-256SUMS");
pub const REAL_SIGNATURE: &[u8] = include_bytes!("../fixtures/ytdlp_verify/real/SHA2-256SUMS.sig");

pub fn sha256_hex(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{:02x}", byte))
        .collect()
}

pub struct TestSigner {
    key: SignedSecretKey,
}

impl TestSigner {
    pub fn generate() -> Self {
        let key = SecretKeyParamsBuilder::default()
            .key_type(KeyType::Ed25519)
            .can_certify(true)
            .can_sign(true)
            .primary_user_id("Test Signer <signer@test.invalid>".into())
            .build()
            .unwrap()
            .generate(rand::thread_rng())
            .unwrap();

        Self { key }
    }

    pub fn sign(&self, data: &[u8]) -> Vec<u8> {
        DetachedSignature::sign_binary_data(
            rand::thread_rng(),
            &self.key.primary_key,
            &Password::empty(),
            HashAlgorithm::Sha256,
            data,
        )
        .unwrap()
        .to_bytes()
        .unwrap()
    }

    pub fn public_key(&self) -> String {
        self.key
            .to_public_key()
            .to_armored_string(ArmorOptions::default())
            .unwrap()
    }
}

pub struct SignedRelease {
    pub sums: Vec<u8>,
    pub signature: Vec<u8>,
}

impl SignedRelease {
    pub fn verify(&self, trusted: &TestSigner, filename: &str) -> Result<String, VerifyError> {
        verify_sums(&self.sums, &self.signature, filename, &trusted.public_key())
    }

    pub fn verify_zip(&self, trusted: &TestSigner, zip: &[u8]) -> Result<(), VerifyError> {
        let expected = self.verify(trusted, ZIP_NAME)?;
        verify_hash(&expected, &sha256_hex(zip))
    }
}

pub struct SignedReleaseBuilder<'signer> {
    entries: Vec<(String, String)>,
    signer: Option<&'signer TestSigner>,
}

impl<'signer> SignedReleaseBuilder<'signer> {
    pub fn new() -> Self {
        Self {
            entries: Vec::new(),
            signer: None,
        }
    }

    pub fn with_entry(mut self, filename: &str, hash: &str) -> Self {
        self.entries.push((filename.to_string(), hash.to_string()));
        self
    }

    pub fn signed_by(mut self, signer: &'signer TestSigner) -> Self {
        self.signer = Some(signer);
        self
    }

    pub fn sums(&self) -> Vec<u8> {
        self.entries
            .iter()
            .map(|(filename, hash)| format!("{}  {}\n", hash, filename))
            .collect::<String>()
            .into_bytes()
    }

    pub fn build(self) -> SignedRelease {
        let sums = self.sums();
        let signer = self
            .signer
            .expect("SignedReleaseBuilder needs a signer: call signed_by");

        SignedRelease {
            signature: signer.sign(&sums),
            sums,
        }
    }
}

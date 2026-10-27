use super::fixtures::{
    sha256_hex, SignedRelease, SignedReleaseBuilder, TestSigner, ATTACKER_ZIP, OTHER_ZIP_NAME,
    REAL_SIGNATURE, REAL_SUMS, RELEASE_ZIP, ZIP_NAME,
};
use super::{verify_sums, MalformedInput, VerifyError, YTDLP_PUBLIC_KEY};

mod sums_lookup {
    use super::*;

    #[test]
    fn returns_the_hash_listed_for_the_file_in_correctly_signed_sums() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(OTHER_ZIP_NAME, &"a".repeat(64))
            .with_entry(ZIP_NAME, &"b".repeat(64))
            .signed_by(&signer)
            .build();

        let result = release.verify(&signer, ZIP_NAME);

        assert_eq!(result, Ok("b".repeat(64)));
    }

    #[test]
    fn rejects_a_file_missing_from_sums() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(OTHER_ZIP_NAME, &"a".repeat(64))
            .with_entry(ZIP_NAME, &"b".repeat(64))
            .signed_by(&signer)
            .build();

        let result = release.verify(&signer, "yt-dlp_win.zip");

        assert_eq!(
            result,
            Err(VerifyError::MissingFromSums("yt-dlp_win.zip".to_string()))
        );
    }

    #[test]
    fn rejects_a_filename_that_only_partially_matches_a_sums_entry() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(OTHER_ZIP_NAME, &"a".repeat(64))
            .with_entry(ZIP_NAME, &"b".repeat(64))
            .signed_by(&signer)
            .build();

        let result = release.verify(&signer, "linux.zip");

        assert_eq!(
            result,
            Err(VerifyError::MissingFromSums("linux.zip".to_string()))
        );
    }
}

mod zip_hash {
    use super::*;

    #[test]
    fn accepts_a_zip_whose_hash_matches_correctly_signed_sums() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .signed_by(&signer)
            .build();

        let result = release.verify_zip(&signer, RELEASE_ZIP);

        assert_eq!(result, Ok(()));
    }

    #[test]
    fn rejects_a_zip_whose_hash_differs_from_correctly_signed_sums() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .signed_by(&signer)
            .build();

        let result = release.verify_zip(&signer, ATTACKER_ZIP);

        assert_eq!(
            result,
            Err(VerifyError::HashMismatch {
                expected: sha256_hex(RELEASE_ZIP),
                actual: sha256_hex(ATTACKER_ZIP),
            })
        );
    }
}

mod signature {
    use super::*;

    #[test]
    fn rejects_sums_rewritten_to_match_an_attackers_zip() {
        let signer = TestSigner::generate();
        let original = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(RELEASE_ZIP))
            .signed_by(&signer)
            .build();
        let rewritten = SignedRelease {
            sums: SignedReleaseBuilder::new()
                .with_entry(ZIP_NAME, &sha256_hex(ATTACKER_ZIP))
                .sums(),
            signature: original.signature,
        };

        let result = rewritten.verify_zip(&signer, ATTACKER_ZIP);

        assert_eq!(result, Err(VerifyError::BadSignature));
    }

    #[test]
    fn rejects_sums_signed_by_a_different_key() {
        let trusted = TestSigner::generate();
        let attacker = TestSigner::generate();
        let forged = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &sha256_hex(ATTACKER_ZIP))
            .signed_by(&attacker)
            .build();

        let result = forged.verify_zip(&trusted, ATTACKER_ZIP);

        assert_eq!(result, Err(VerifyError::BadSignature));
    }
}

mod malformed_input {
    use super::*;

    #[test]
    fn rejects_a_signature_that_is_not_openpgp() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &"a".repeat(64))
            .signed_by(&signer)
            .build();

        let result = verify_sums(
            &release.sums,
            b"not a signature",
            ZIP_NAME,
            &signer.public_key(),
        );

        assert_eq!(
            result,
            Err(VerifyError::Malformed(MalformedInput::Signature))
        );
    }

    #[test]
    fn rejects_a_public_key_that_is_not_openpgp() {
        let signer = TestSigner::generate();
        let release = SignedReleaseBuilder::new()
            .with_entry(ZIP_NAME, &"a".repeat(64))
            .signed_by(&signer)
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
}

mod real_release {
    use super::*;

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

fn normalize(value: &str) -> String {
    value
        .trim()
        .to_lowercase()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}

pub fn fingerprint(artists: &[String], title: &str) -> String {
    let normalized_artists = artists
        .iter()
        .map(|artist| normalize(artist))
        .collect::<Vec<_>>()
        .join(", ");

    format!("{}\x1F{}", normalized_artists, normalize(title))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lowercases_and_trims() {
        let result = fingerprint(&["  Radiohead  ".into()], "  Creep  ");
        assert_eq!(result, "radiohead\x1Fcreep");
    }

    #[test]
    fn collapses_internal_whitespace() {
        let result = fingerprint(&["The   Black   Keys".into()], "Lonely   Boy");
        assert_eq!(result, "the black keys\x1Flonely boy");
    }

    #[test]
    fn joins_multiple_artists() {
        let result = fingerprint(
            &["Daft Punk".into(), "Pharrell Williams".into()],
            "Get Lucky",
        );
        assert_eq!(result, "daft punk, pharrell williams\x1Fget lucky");
    }

    #[test]
    fn same_track_different_casing_produces_same_fingerprint() {
        let a = fingerprint(&["RADIOHEAD".into()], "CREEP");
        let b = fingerprint(&["radiohead".into()], "creep");
        assert_eq!(a, b);
    }

    #[test]
    fn different_titles_produce_different_fingerprints() {
        let a = fingerprint(&["Radiohead".into()], "Creep");
        let b = fingerprint(&["Radiohead".into()], "Karma Police");
        assert_ne!(a, b);
    }
}

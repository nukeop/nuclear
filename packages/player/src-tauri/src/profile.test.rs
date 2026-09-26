use super::{parse_profile, profile_identifier};

fn arguments(values: &[&str]) -> Vec<String> {
    values.iter().map(|value| value.to_string()).collect()
}

#[test]
fn no_profile_argument_gives_no_profile() {
    assert_eq!(parse_profile(arguments(&["nuclear"])), Ok(None));
}

#[test]
fn profile_argument_gives_profile_name() {
    assert_eq!(
        parse_profile(arguments(&["nuclear", "--profile", "demo"])),
        Ok(Some("demo".to_string()))
    );
}

#[test]
fn profile_argument_without_value_is_an_error() {
    assert_eq!(
        parse_profile(arguments(&["nuclear", "--profile"])),
        Err("--profile needs a profile name".to_string())
    );
}

#[test]
fn unsafe_profile_name_is_an_error() {
    assert_eq!(
        parse_profile(arguments(&["nuclear", "--profile", "../x"])),
        Err(
            "Invalid profile name \"../x\". Use only letters, digits, hyphens, and underscores."
                .to_string()
        )
    );
}

#[test]
fn empty_profile_name_is_an_error() {
    assert_eq!(
        parse_profile(arguments(&["nuclear", "--profile", ""])),
        Err(
            "Invalid profile name \"\". Use only letters, digits, hyphens, and underscores."
                .to_string()
        )
    );
}

#[test]
fn profile_identifier_appends_profile_name() {
    assert_eq!(
        profile_identifier("com.nuclearplayer", "demo"),
        "com.nuclearplayer.profile.demo"
    );
}

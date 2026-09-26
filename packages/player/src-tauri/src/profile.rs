const PROFILE_FLAG: &str = "--profile";

pub struct DefaultIdentifier(pub String);

fn is_safe_name(name: &str) -> bool {
    !name.is_empty()
        && name.chars().all(|character| {
            character.is_ascii_alphanumeric() || character == '-' || character == '_'
        })
}

pub fn parse_profile(
    arguments: impl IntoIterator<Item = String>,
) -> Result<Option<String>, String> {
    let mut from_flag = arguments
        .into_iter()
        .skip_while(|argument| argument != PROFILE_FLAG);

    match (from_flag.next(), from_flag.next()) {
        (None, _) => Ok(None),
        (Some(_), None) => Err(format!("{PROFILE_FLAG} needs a profile name")),
        (Some(_), Some(name)) if is_safe_name(&name) => Ok(Some(name)),
        (Some(_), Some(name)) => Err(format!(
            "Invalid profile name \"{name}\". Use only letters, digits, hyphens, and underscores."
        )),
    }
}

pub fn profile_identifier(default_identifier: &str, profile: &str) -> String {
    format!("{default_identifier}.profile.{profile}")
}

#[cfg(test)]
#[path = "profile.test.rs"]
mod tests;

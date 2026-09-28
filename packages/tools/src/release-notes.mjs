const TYPE_LABELS = {
  feature: 'Feature',
  fix: 'Fix',
  improvement: 'Improvement',
  chore: 'Chore',
  plugin: 'Plugin',
  docs: 'Docs',
};

const MACOS_GATEKEEPER_NOTE =
  "> **macOS:** If the app won't open, run `sudo xattr -r -d com.apple.quarantine /Applications/Nuclear.app` in Terminal.";

function formatTags(tags = []) {
  return tags.map((tag) => `\`${tag.label}\``).join(' ');
}

function formatContributors(contributors = []) {
  return contributors.map((name) => `@${name}`).join(', ');
}

function formatEntry(entry) {
  const label = TYPE_LABELS[entry.type] ?? entry.type;
  const contributors = formatContributors(entry.contributors);
  return [
    `- **${label}**: ${entry.description}`,
    formatTags(entry.tags),
    contributors && `- ${contributors}`,
  ]
    .filter(Boolean)
    .join(' ');
}

function describeEntries(version, entries) {
  if (entries.length === 0) {
    return `Nuclear Player release v${version}`;
  }

  return [`## What's New in v${version}`, '', ...entries.map(formatEntry)].join(
    '\n',
  );
}

export function formatReleaseNotes(version, entries) {
  return [describeEntries(version, entries), MACOS_GATEKEEPER_NOTE].join(
    '\n\n',
  );
}

export const PLACEHOLDER = '<!-- releases generated at build time -->';
const RELEASES_TO_INCLUDE = 5;

export function getChangelogForRelease(tag, previousTag, changelog) {
  return changelog.filter((entry) => {
    const entryDate = entry.date.split('T')[0];
    if (previousTag) {
      return entryDate <= tag.date && entryDate > previousTag.date;
    }
    return entryDate <= tag.date;
  });
}

export function buildReleaseElement(tag, entries) {
  if (entries.length === 0) {
    return [
      `    <release version="${tag.version}" date="${tag.date}">`,
      '      <description>',
      `        <p>Release ${tag.version}.</p>`,
      '      </description>',
      '    </release>',
    ].join('\n');
  }

  const listItems = entries
    .map((entry) => `          <li>${entry.description}</li>`)
    .join('\n');

  return [
    `    <release version="${tag.version}" date="${tag.date}">`,
    '      <description>',
    '        <ul>',
    listItems,
    '        </ul>',
    '      </description>',
    '    </release>',
  ].join('\n');
}

export function generateReleasesBlock(tags, changelog) {
  const recentTags = tags.slice(0, RELEASES_TO_INCLUDE);
  const elements = recentTags.map((tag, index) => {
    const previousTag = tags[index + 1];
    const entries = getChangelogForRelease(tag, previousTag, changelog);
    return buildReleaseElement(tag, entries);
  });

  return `<releases>\n${elements.join('\n')}\n  </releases>`;
}

export function injectReleases(metainfo, releasesBlock) {
  if (!metainfo.includes(PLACEHOLDER)) {
    throw new Error(`Placeholder "${PLACEHOLDER}" not found in metainfo`);
  }
  return metainfo.replace(PLACEHOLDER, releasesBlock);
}

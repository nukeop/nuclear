const INDENT = '  ';
const RELEASE_DEPTH = 2;
const RELEASES_OPENING_TAG = '<releases>';

function escapeXml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderElement({ name, attributes = {}, children }, depth) {
  const pad = INDENT.repeat(depth);
  const attributeText = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');

  if (typeof children === 'string') {
    return `${pad}<${name}${attributeText}>${children}</${name}>`;
  }

  const inner = children
    .map((child) => renderElement(child, depth + 1))
    .join('\n');
  return `${pad}<${name}${attributeText}>\n${inner}\n${pad}</${name}>`;
}

function describeRelease(tag, entries) {
  if (entries.length === 0) {
    return [{ name: 'p', children: `Release ${tag.version}.` }];
  }

  const items = entries.map((entry) => ({
    name: 'li',
    children: escapeXml(entry.description),
  }));
  return [{ name: 'ul', children: items }];
}

export function getChangelogForRelease(tag, previousTag, changelog) {
  const releasedAfter = previousTag?.date ?? '';
  return changelog.filter((entry) => {
    const entryDate = entry.date.split('T')[0];
    return entryDate > releasedAfter && entryDate <= tag.date;
  });
}

export function buildReleaseElement(tag, entries) {
  const release = {
    name: 'release',
    attributes: { version: tag.version, date: tag.date },
    children: [
      { name: 'description', children: describeRelease(tag, entries) },
    ],
  };
  return renderElement(release, RELEASE_DEPTH);
}

export function prependRelease(metainfo, releaseElement) {
  const openingTagIndex = metainfo.indexOf(RELEASES_OPENING_TAG);
  if (openingTagIndex === -1) {
    throw new Error('No <releases> element found in metainfo');
  }

  const insertionPoint = openingTagIndex + RELEASES_OPENING_TAG.length;
  return (
    metainfo.slice(0, insertionPoint) +
    '\n' +
    releaseElement +
    metainfo.slice(insertionPoint)
  );
}

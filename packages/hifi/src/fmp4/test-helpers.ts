export function writeUint32(value: number): number[] {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ];
}

export function writeUint16(value: number): number[] {
  return [(value >>> 8) & 0xff, value & 0xff];
}

export function writeAscii(text: string): number[] {
  return [...text].map((char) => char.charCodeAt(0));
}

export function buildBoxHeader(type: string, size: number): number[] {
  return [...writeUint32(size), ...writeAscii(type)];
}

export function buildBoxWithPadding(type: string, totalSize: number): number[] {
  const header = buildBoxHeader(type, totalSize);
  const padding = new Array(totalSize - header.length).fill(0);
  return [...header, ...padding];
}

export function buildSidxBody(options: {
  version: number;
  timescale: number;
  earliestPresentationTime: number;
  firstOffset: number;
  references: { referencedSize: number; subsegmentDuration: number }[];
}): number[] {
  const body: number[] = [];

  body.push(options.version);
  body.push(0, 0, 0);

  body.push(...writeUint32(1));

  body.push(...writeUint32(options.timescale));

  if (options.version === 0) {
    body.push(...writeUint32(options.earliestPresentationTime));
    body.push(...writeUint32(options.firstOffset));
  } else {
    body.push(
      ...writeUint32(0),
      ...writeUint32(options.earliestPresentationTime),
    );
    body.push(...writeUint32(0), ...writeUint32(options.firstOffset));
  }

  body.push(...writeUint16(0));
  body.push(...writeUint16(options.references.length));

  for (const ref of options.references) {
    body.push(...writeUint32(ref.referencedSize & 0x7fffffff));
    body.push(...writeUint32(ref.subsegmentDuration));
    body.push(...writeUint32(0));
  }

  return body;
}

export function buildSidxBox(
  options: Parameters<typeof buildSidxBody>[0],
): number[] {
  const body = buildSidxBody(options);
  const totalSize = 8 + body.length;
  return [...buildBoxHeader('sidx', totalSize), ...body];
}

const BOX_HEADER_SIZE = 8;
const SIDX_REFERENCE_ID = 1;
const REFERENCED_SIZE_MASK = 0x7fffffff;

export class ByteWriter {
  private bytes: number[] = [];

  byte(value: number): this {
    this.bytes.push(value & 0xff);
    return this;
  }

  uint16(value: number): this {
    this.bytes.push((value >>> 8) & 0xff, value & 0xff);
    return this;
  }

  uint32(value: number): this {
    this.bytes.push(
      (value >>> 24) & 0xff,
      (value >>> 16) & 0xff,
      (value >>> 8) & 0xff,
      value & 0xff,
    );
    return this;
  }

  ascii(text: string): this {
    for (const char of text) {
      this.bytes.push(char.charCodeAt(0));
    }
    return this;
  }

  zeros(count: number): this {
    this.bytes.push(...new Array(count).fill(0));
    return this;
  }

  toBytes(): number[] {
    return [...this.bytes];
  }
}

export function paddedBox(type: string, totalSize: number): number[] {
  return new ByteWriter()
    .uint32(totalSize)
    .ascii(type)
    .zeros(totalSize - BOX_HEADER_SIZE)
    .toBytes();
}

type SidxReference = {
  referencedSize: number;
  subsegmentDuration: number;
};

export class SidxBoxBuilder {
  private version = 0;
  private timescale = 44100;
  private earliestPresentationTime = 0;
  private firstOffset = 0;
  private references: SidxReference[] = [];

  withVersion(version: number): this {
    this.version = version;
    return this;
  }

  withTimescale(timescale: number): this {
    this.timescale = timescale;
    return this;
  }

  withReference(referencedSize: number, subsegmentDuration: number): this {
    this.references.push({ referencedSize, subsegmentDuration });
    return this;
  }

  build(): number[] {
    const body = this.buildBody();
    return new ByteWriter()
      .uint32(BOX_HEADER_SIZE + body.length)
      .ascii('sidx')
      .toBytes()
      .concat(body);
  }

  private buildBody(): number[] {
    const writer = new ByteWriter()
      .byte(this.version)
      .zeros(3)
      .uint32(SIDX_REFERENCE_ID)
      .uint32(this.timescale);

    if (this.version === 0) {
      writer.uint32(this.earliestPresentationTime).uint32(this.firstOffset);
    } else {
      writer
        .uint32(0)
        .uint32(this.earliestPresentationTime)
        .uint32(0)
        .uint32(this.firstOffset);
    }

    writer.uint16(0).uint16(this.references.length);

    for (const reference of this.references) {
      writer
        .uint32(reference.referencedSize & REFERENCED_SIZE_MASK)
        .uint32(reference.subsegmentDuration)
        .uint32(0);
    }

    return writer.toBytes();
  }
}

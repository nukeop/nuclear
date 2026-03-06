export class BinaryReader {
  private readonly view: DataView;
  private cursor: number;

  constructor(data: Uint8Array, offset = 0) {
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    this.cursor = offset;
  }

  get position(): number {
    return this.cursor;
  }

  readUint8(): number {
    const value = this.view.getUint8(this.cursor);
    this.cursor += 1;
    return value;
  }

  readUint16(): number {
    const value = this.view.getUint16(this.cursor);
    this.cursor += 2;
    return value;
  }

  readUint32(): number {
    const value = this.view.getUint32(this.cursor);
    this.cursor += 4;
    return value;
  }

  readUint64(): number {
    const high = this.view.getUint32(this.cursor);
    const low = this.view.getUint32(this.cursor + 4);
    this.cursor += 8;
    return high * 0x100000000 + low;
  }

  readAscii(length: number): string {
    let result = '';
    for (let index = 0; index < length; index++) {
      result += String.fromCharCode(this.view.getUint8(this.cursor + index));
    }
    this.cursor += length;
    return result;
  }

  skip(bytes: number): void {
    this.cursor += bytes;
  }

  hasRemaining(bytes: number): boolean {
    return this.cursor + bytes <= this.view.byteLength;
  }
}

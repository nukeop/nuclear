import { BinaryReader } from './BinaryReader';

function bytes(...values: number[]): Uint8Array {
  return new Uint8Array(values);
}

describe('BinaryReader', () => {
  describe('readUint8', () => {
    it('reads a single byte and advances by 1', () => {
      const reader = new BinaryReader(bytes(0xab, 0xcd));

      expect(reader.readUint8()).toBe(0xab);
      expect(reader.position).toBe(1);
      expect(reader.readUint8()).toBe(0xcd);
      expect(reader.position).toBe(2);
    });
  });

  describe('readUint16', () => {
    it('reads big-endian 16-bit value and advances by 2', () => {
      const reader = new BinaryReader(bytes(0x01, 0x02));

      expect(reader.readUint16()).toBe(0x0102);
      expect(reader.position).toBe(2);
    });
  });

  describe('readUint32', () => {
    it('reads big-endian 32-bit value and advances by 4', () => {
      const reader = new BinaryReader(bytes(0x00, 0x01, 0x00, 0x00));

      expect(reader.readUint32()).toBe(65536);
      expect(reader.position).toBe(4);
    });

    it('handles high-bit values without sign extension', () => {
      const reader = new BinaryReader(bytes(0xff, 0xff, 0xff, 0xff));

      expect(reader.readUint32()).toBe(0xffffffff);
    });
  });

  describe('readUint64', () => {
    it('reads a 64-bit value split across two 32-bit halves', () => {
      const reader = new BinaryReader(
        bytes(0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00),
      );

      expect(reader.readUint64()).toBe(0x100000000);
      expect(reader.position).toBe(8);
    });

    it('reads zero correctly', () => {
      const reader = new BinaryReader(
        bytes(0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00),
      );

      expect(reader.readUint64()).toBe(0);
    });
  });

  describe('readAscii', () => {
    it('reads ASCII string of given length', () => {
      const reader = new BinaryReader(bytes(0x66, 0x74, 0x79, 0x70, 0x00));

      expect(reader.readAscii(4)).toBe('ftyp');
      expect(reader.position).toBe(4);
    });
  });

  describe('skip', () => {
    it('advances position without reading', () => {
      const reader = new BinaryReader(bytes(0x01, 0x02, 0x03, 0x04));
      reader.skip(2);

      expect(reader.position).toBe(2);
      expect(reader.readUint8()).toBe(0x03);
    });
  });

  describe('hasRemaining', () => {
    it('returns true when enough bytes remain', () => {
      const reader = new BinaryReader(bytes(0x01, 0x02, 0x03, 0x04));

      expect(reader.hasRemaining(4)).toBe(true);
      expect(reader.hasRemaining(5)).toBe(false);
    });

    it('accounts for already-consumed bytes', () => {
      const reader = new BinaryReader(bytes(0x01, 0x02, 0x03, 0x04));
      reader.skip(2);

      expect(reader.hasRemaining(2)).toBe(true);
      expect(reader.hasRemaining(3)).toBe(false);
    });
  });

  describe('constructor offset', () => {
    it('starts reading from the given offset', () => {
      const reader = new BinaryReader(bytes(0xaa, 0xbb, 0xcc, 0xdd), 2);

      expect(reader.position).toBe(2);
      expect(reader.readUint8()).toBe(0xcc);
    });
  });

  describe('sequential reads', () => {
    it('reads mixed types in sequence without manual offset tracking', () => {
      const data = bytes(
        0x01,
        0x00,
        0x0a,
        0x00,
        0x00,
        0xac,
        0x44,
        0x66,
        0x74,
        0x79,
        0x70,
      );
      const reader = new BinaryReader(data);

      expect(reader.readUint8()).toBe(1);
      expect(reader.readUint16()).toBe(10);
      expect(reader.readUint32()).toBe(44100);
      expect(reader.readAscii(4)).toBe('ftyp');
      expect(reader.position).toBe(data.length);
    });
  });
});

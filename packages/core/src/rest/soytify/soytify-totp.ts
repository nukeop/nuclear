import * as crypto from 'crypto';

export class TOTP {
  private secret: Buffer;
  private version: number;
  private period: number;
  private digits: number;

  constructor() {
    this.secret = Buffer.from('5507145853487499592248630329347');
    this.version = 5;
    this.period = 30;
    this.digits = 6;
  }

  generate(timestamp: number): string {
    const counter = Math.floor(timestamp / 1000 / this.period);
    
    const counterBuffer = Buffer.alloc(8);
    const high = Math.floor(counter / 0x100000000);
    const low = counter >>> 0;
    counterBuffer.writeUInt32BE(high, 0);
    counterBuffer.writeUInt32BE(low, 4);
    
    const hmac = crypto.createHmac('sha1', this.secret);
    hmac.update(counterBuffer);
    const hmacResult = hmac.digest();
    
    const offset = hmacResult[hmacResult.length - 1] & 0x0f;
    const binary = 
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);
    
    return (binary % Math.pow(10, this.digits)).toString().padStart(this.digits, '0');
  }
  
  getVersion(): number {
    return this.version;
  }
}
